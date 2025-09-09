// src/app/api/cart/update/route.js
import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function POST(req) {
  try {
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getConnection();

    // Get the cart item ID for this user & product
    const result = await db.query(
      `SELECT ci.id as cart_item_id
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = $1 AND ci.product_id = $2`,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    const { cart_item_id } = result.rows[0];

    if (quantity > 0) {
      // Update quantity
      await db.query(
        `UPDATE cart_items
         SET quantity = $1
         WHERE id = $2`,
        [quantity, cart_item_id]
      );
      return NextResponse.json({ success: true, message: "Quantity updated" });
    } else {
      // Remove item
      await db.query(
        `DELETE FROM cart_items
         WHERE id = $1`,
        [cart_item_id]
      );
      return NextResponse.json({ success: true, message: "Item removed from cart" });
    }
  } catch (err) {
    console.error("Cart update error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
