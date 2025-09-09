import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ Get all products with category
export async function GET() {
  const db = await getConnection();
  const [rows] = await db.execute(`
    SELECT p.*, c.name as category_name 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
  `);
  return NextResponse.json(rows);
}

// ✅ Create new product
export async function POST(req) {
  const { name, price, description, stock, image_url, category_id } =
    await req.json();

  if (!name || !price || !category_id) {
    return NextResponse.json(
      { error: "Name, price, and category are required" },
      { status: 400 }
    );
  }

  const db = await getConnection();
  await db.execute(
    "INSERT INTO products (name, price, description, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)",
    [name, price, description || "", stock || 0, image_url || null, category_id]
  );

  return NextResponse.json({ message: "Product created" }, { status: 201 });
}
