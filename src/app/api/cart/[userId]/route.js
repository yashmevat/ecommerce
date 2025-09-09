// src/app/api/cart/[userId]/route.js
import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

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
