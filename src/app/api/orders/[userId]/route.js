import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

export async function GET(req, { params }) {
  try {
    const { userId } = params;
    const db = getConnection(); // Pool instance

    // Fetch all orders for this user
    const result = await db.query(
      `SELECT id, total_amount, status, created_at
       FROM orders
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("🔥 GET /orders/[userId] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
