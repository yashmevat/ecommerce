import { getConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

// ✅ Get all products with category
export async function GET() {
  try {
    const db = getConnection();
    const { rows } = await db.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("🔥 GET /products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Create new product
export async function POST(req) {
  try {
    const { name, price, description, stock, image_url, category_id } = await req.json();

    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const db = getConnection();
    await db.query(
      `INSERT INTO products (name, price, description, stock, image_url, category_id) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, price, description || "", stock || 0, image_url || null, category_id]
    );

    return NextResponse.json({ message: "Product created" }, { status: 201 });
  } catch (error) {
    console.error("🔥 POST /products error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
