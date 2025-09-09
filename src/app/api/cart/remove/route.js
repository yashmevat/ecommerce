// src/app/api/cart/remove/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, productId } = await req.json();
    const db = await getConnection();

    // First, get the current quantity
    const [rows] = await db.execute(
      `SELECT ci.quantity
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = ? AND ci.product_id = ?`,
      [userId, productId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    const currentQuantity = rows[0].quantity;

    if (currentQuantity > 1) {
      // Reduce quantity by 1
      await db.execute(
        `UPDATE cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         SET ci.quantity = ci.quantity - 1
         WHERE c.user_id = ? AND ci.product_id = ?`,
        [userId, productId]
      );
      return NextResponse.json({ success: true, message: "Quantity decreased by 1" });
    } else {
      // Remove item if quantity is 1
      await db.execute(
        `DELETE ci FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         WHERE c.user_id = ? AND ci.product_id = ?`,
        [userId, productId]
      );
      return NextResponse.json({ success: true, message: "Item removed from cart" });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
