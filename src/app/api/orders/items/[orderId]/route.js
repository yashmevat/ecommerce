import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { orderId } = params;
    const db = await getConnection();

    const items = await db.query(
      `SELECT oi.id, oi.quantity, p.name, p.price, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    return NextResponse.json(items.rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
