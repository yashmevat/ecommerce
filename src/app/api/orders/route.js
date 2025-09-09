import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ Get orders (all or by status)
export async function GET(req) {
  try {
    const db = await getConnection();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = "SELECT * FROM orders";
    let values = [];

    if (status) {
      query += " WHERE status = ?";
      values.push(status);
    }

    const [rows] = await db.execute(query, values);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
