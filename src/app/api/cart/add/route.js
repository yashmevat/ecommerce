// src/app/api/cart/add/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, productId, quantity = 1 } = await req.json();
    const db = getConnection();

    // Ensure user has a cart
    const cartResult = await db.query("SELECT id FROM carts WHERE user_id = $1", [userId]);
    let cartId;

    if (cartResult.rows.length === 0) {
      const insertCart = await db.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      cartId = insertCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Insert / update product in cart_items
    // PostgreSQL uses ON CONFLICT instead of MySQL's ON DUPLICATE KEY
    await db.query(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (cart_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [cartId, productId, quantity]
    );

    return NextResponse.json({ success: true, message: "Product added to cart" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
