// src/app/api/products/route.js
import { NextResponse } from "next/server";
import { getConnection } from "../../../lib/db";

export async function GET(req) {
  try {
    const db = getConnection();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category_id");

    let query = "SELECT * FROM products";
    let values = [];

    if (categoryId) {
      query += " WHERE category_id = $1";
      values.push(categoryId);
    }

    const result = await db.query(query, values);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("🔥 GET /products error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
