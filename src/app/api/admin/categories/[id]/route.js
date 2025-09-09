import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ Update category
export async function PUT(req, { params }) {
  const { name } = await req.json();
  const db = await getConnection();
  await db.execute("UPDATE categories SET name = ? WHERE id = ?", [name, params.id]);
  return NextResponse.json({ message: "Category updated" });
}

// ✅ Delete category
export async function DELETE(req, { params }) {
  const db = await getConnection();
  await db.execute("DELETE FROM categories WHERE id = ?", [params.id]);
  return NextResponse.json({ message: "Category deleted" });
}
