// src/app/api/cart/add/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, productId, quantity = 1 } = await req.json();
    const db = await getConnection();

    // Ensure user has a cart
    const [cartRows] = await db.execute(
      "SELECT id FROM carts WHERE user_id = ?",
      [userId]
    );

    let cartId;
    if (cartRows.length === 0) {
      const [insertCart] = await db.execute(
        "INSERT INTO carts (user_id) VALUES (?)",
        [userId]
      );
      cartId = insertCart.insertId;
    } else {
      cartId = cartRows[0].id;
    }

    // Insert / update product in cart_items
    await db.execute(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [cartId, productId, quantity, quantity]
    );

    return NextResponse.json({ success: true, message: "Product added to cart" });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
