import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const db = getConnection();

    // 1️⃣ Fetch cart items
    const cartResult = await db.query(
      `SELECT ci.product_id, ci.quantity, p.price
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

    // 2️⃣ Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 3️⃣ Create a new order and get the inserted order ID
    const orderResult = await db.query(
      `INSERT INTO orders (user_id, total_amount, status, created_at)
       VALUES ($1, $2, 'pending', NOW())
       RETURNING id`,
      [userId, totalAmount]
    );

    const orderId = orderResult.rows[0].id;

    // 4️⃣ Insert order items
    const values = [];
    const placeholders = [];
    cartItems.forEach((item, index) => {
      const baseIndex = index * 4;
      placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`);
      values.push(orderId, item.product_id, item.quantity, item.price);
    });

    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ${placeholders.join(", ")}`,
      values
    );

    // 5️⃣ Clear user's cart
    await db.query(
      `DELETE FROM cart_items
       WHERE cart_id IN (SELECT id FROM carts WHERE user_id = $1)`,
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderId,
      totalAmount,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
