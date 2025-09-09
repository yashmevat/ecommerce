// src/app/api/cart/remove/route.js
import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function POST(req) {
  try {
    const { userId, productId } = await req.json();
    const db = getConnection();

    // Get the current quantity
    const result = await db.query(
      `SELECT ci.quantity, ci.id as cart_item_id
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = $1 AND ci.product_id = $2`,
      [userId, productId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    const { quantity, cart_item_id } = result.rows[0];

    if (quantity > 1) {
      // Reduce quantity by 1
      await db.query(
        `UPDATE cart_items
         SET quantity = quantity - 1
         WHERE id = $1`,
        [cart_item_id]
      );
      return NextResponse.json({ success: true, message: "Quantity decreased by 1" });
    } else {
      // Remove item if quantity is 1
      await db.query(
        `DELETE FROM cart_items
         WHERE id = $1`,
        [cart_item_id]
      );
      return NextResponse.json({ success: true, message: "Item removed from cart" });
    }
  } catch (err) {
    console.error("Cart remove error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
