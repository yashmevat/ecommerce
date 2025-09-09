import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ Update product
export async function PUT(req, { params }) {
  const { name, price, description, stock, image_url, category_id } =
    await req.json();

  const db = await getConnection();
  await db.execute(
    "UPDATE products SET name = ?, price = ?, description = ?, stock = ?, image_url = ?, category_id = ? WHERE id = ?",
    [name, price, description, stock, image_url, category_id, params.id]
  );

  return NextResponse.json({ message: "Product updated" });
}

// ✅ Delete product
export async function DELETE(req, { params }) {
  const db = await getConnection();
  await db.execute("DELETE FROM products WHERE id = ?", [params.id]);
  return NextResponse.json({ message: "Product deleted" });
}
