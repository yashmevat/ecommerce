import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ Get single customer by user_id
export async function GET(req, { params }) {
  try {
    const db = await getConnection();
    const [rows] = await db.execute("SELECT id, name, email FROM users WHERE id = ?", [params.id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
