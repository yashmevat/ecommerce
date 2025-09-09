// src/app/api/cart/update/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, productId, quantity } = await req.json();

    console.log(userId,quantity,productId)

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await getConnection();

    if (quantity > 0) {
      // Update the quantity for the cart item
      await db.execute(
        `UPDATE cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         SET ci.quantity = ?
         WHERE c.user_id = ? AND ci.product_id = ?`,
        [quantity, userId, productId]
      );

      return NextResponse.json({ success: true, message: "Quantity updated" });
    } else {
      // Remove item if quantity is 0
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
