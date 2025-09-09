import { NextResponse } from "next/server";
import { getConnection } from "../../../../lib/db";

// ✅ Get single customer by user_id
export async function GET(req, { params }) {
  try {
    const db = getConnection(); // Pool instance
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("🔥 GET /users/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
