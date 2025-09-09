// src/app/api/checkout/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const db = await getConnection();

    // 1️⃣ Fetch cart items
    const [cartItems] = await db.execute(
      `SELECT ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 2️⃣ Calculate total amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // 3️⃣ Create a new order
    const [orderResult] = await db.execute(
      `INSERT INTO orders (user_id, total_amount, status, created_at)
       VALUES (?, ?, 'pending', NOW())`,
      [userId, totalAmount]
    );

    const orderId = orderResult.insertId;

    // 4️⃣ Insert order items
    const orderItemsData = cartItems.map(
      (item) => [orderId, item.product_id, item.quantity, item.price]
    );

    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price)
       VALUES ?`,
      [orderItemsData]
    );

    // 5️⃣ Clear user's cart
    await db.execute(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = ?`,
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
