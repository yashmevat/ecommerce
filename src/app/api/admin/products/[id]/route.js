import { getConnection } from "../../../../../lib/db";
import { NextResponse } from "next/server";

// ✅ Update product
export async function PUT(req, { params }) {
  try {
    const { name, price, description, stock, image_url, category_id } = await req.json();

    const db = getConnection();
    await db.query(
      `UPDATE products 
       SET name = $1, price = $2, description = $3, stock = $4, image_url = $5, category_id = $6
       WHERE id = $7`,
      [name, price, description, stock, image_url, category_id, params.id]
    );

    return NextResponse.json({ message: "Product updated" });
  } catch (error) {
    console.error("🔥 PUT /products/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Delete product
export async function DELETE(req, { params }) {
  try {
    const db = getConnection();
    await db.query("DELETE FROM products WHERE id = $1", [params.id]);

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("🔥 DELETE /products/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
