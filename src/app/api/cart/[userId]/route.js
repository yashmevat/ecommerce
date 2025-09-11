// src/app/api/cart/[userId]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const db = getConnection();

    const result = await db.query(
      `SELECT ci.id, ci.product_id, ci.quantity, p.name, p.price, p.image_url
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = $1`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// ✅ Update quantity
export async function PUT(req, { params }) {
  try {
    const { userId } = params;
    const { productId, quantity } = await req.json();

    const db = getConnection();

    // Get the user's cart id
    const cartRes = await db.query(
      "SELECT id FROM carts WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    if (cartRes.rows.length === 0) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cartId = cartRes.rows[0].id;

    if (quantity <= 0) {
      // ✅ Remove item if quantity is 0
      await db.query(
        "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productId]
      );
    } else {
      // ✅ Update if exists, else insert
      const existing = await db.query(
        "SELECT id FROM cart_items WHERE cart_id = $1 AND product_id = $2",
        [cartId, productId]
      );

      if (existing.rows.length > 0) {
        await db.query(
          "UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3",
          [quantity, cartId, productId]
        );
      } else {
        await db.query(
          "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)",
          [cartId, productId, quantity]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 PUT /cart error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
