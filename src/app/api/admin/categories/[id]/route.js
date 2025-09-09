import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ Update category
export async function PUT(req, { params }) {
  try {
    const { name,description } = await req.json();
    if (!name || !description) {
      return NextResponse.json({ error: "Category name and description required" }, { status: 400 });
    }

    const db = getConnection();
    await db.query("UPDATE categories SET name = $1 , description = $2 WHERE id = $3", [name, description ,params.id]);

    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    console.error("🔥 PUT /categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Delete category
export async function DELETE(req, { params }) {
  try {
    const db = getConnection();
    await db.query("DELETE FROM categories WHERE id = $1", [params.id]);

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("🔥 DELETE /categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
