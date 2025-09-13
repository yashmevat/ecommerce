import { getConnection } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = getConnection();
const { searchParams } = new URL(req.url);

const page = parseInt(searchParams.get("page") || "1");
const limit = parseInt(searchParams.get("limit") || "8");
const offset = (page - 1) * limit;

const categoryId = searchParams.get("category_id");
const categoryIdInt = categoryId ? parseInt(categoryId, 10) : null;

let query = "SELECT * FROM products";
let countQuery = "SELECT COUNT(*) AS total FROM products";
let values = [];

if (categoryIdInt) {
  query += " WHERE category_id = $1";
  countQuery += " WHERE category_id = $1";
  values.push(categoryIdInt);
}

// Add LIMIT & OFFSET
if (categoryIdInt) {
  query += " ORDER BY id DESC LIMIT $2 OFFSET $3";
  values.push(limit, offset);
} else {
  query += " ORDER BY id DESC LIMIT $1 OFFSET $2";
  values.push(limit, offset);
}

// Execute
const { rows: products } = await db.query(query, values);
const { rows } = await db.query(countQuery, categoryIdInt ? [categoryIdInt] : []);
const total = parseInt(rows[0].total, 10);
const totalPages = Math.ceil(total / limit);

return NextResponse.json({ products, totalPages });

  } catch (err) {
    console.error("🔥 GET /products error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
