import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

// ✅ Get orders (all or by status)
export async function GET(req) {
  try {
    const db = getConnection();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = "SELECT * FROM orders";
    let values = [];

    if (status) {
      query += " WHERE status = $1";
      values.push(status);
    }

    const result = await db.query(query, values);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("🔥 GET /orders error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
