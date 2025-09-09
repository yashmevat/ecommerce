import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const db = await getConnection();

    // Fetch all orders for this user
    const [orders] = await db.execute(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
