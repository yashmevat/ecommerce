import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userId ,details} = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const db = getConnection();

    // 1️⃣ Fetch cart items
    const cartResult = await db.query(
      `SELECT ci.product_id, ci.quantity, p.price, p.name
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    const cartItems = cartResult.rows;
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2️⃣ Calculate total
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 3️⃣ Insert pending order
    const orderResult = await db.query(

      `INSERT INTO orders 
        (user_id, total_amount, status, customer_name, customer_email, customer_address, customer_phone, created_at)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6, NOW())
       RETURNING id`,
      [
        userId,
        totalAmount,
        details.name,
        details.email,
        details.address,
        details.phone,
      ]
    );
    const orderId = orderResult.rows[0].id;

    // 4️⃣ Insert order items
    const values = [];
    const placeholders = [];
    cartItems.forEach((item, index) => {
      const baseIndex = index * 4;
      placeholders.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
      );
      values.push(orderId, item.product_id, item.quantity, item.price);
    });

    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ${placeholders.join(", ")}`,
      values
    );

    // ⚠️ Better: clear cart only after payment success via webhook
    
    // 6️⃣ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: cartItems.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100), // paise
            },
            quantity: item.quantity,
        })),
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?orderId=${orderId}`,
        metadata: { orderId: String(orderId) },
    });
    
    // ✅ Return checkout URL for frontend redirect
    await db.query(`DELETE FROM cart_items WHERE cart_id IN (SELECT id FROM carts WHERE user_id = $1)`, [userId]);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
