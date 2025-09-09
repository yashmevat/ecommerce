// src/app/api/products/route.js
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req) {
  try {
    const db = await getConnection();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category_id");

    let query = "SELECT * FROM products";
    let values = [];

    if (categoryId) {
      query += " WHERE category_id = ?";
      values.push(categoryId);
    }

    const [rows] = await db.execute(query, values);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
