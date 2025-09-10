import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route"; // adjust path

// ✅ Update category (Admin only)
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admins only" }, { status: 403 });
    }

    const { name, description } = await req.json();
    if (!name || !description) {
      return NextResponse.json({ error: "Category name and description required" }, { status: 400 });
    }

    const db = getConnection();
    await db.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
      [name, description, params.id]
    );

    return NextResponse.json({ message: "Category updated" });
  } catch (error) {
    console.error("🔥 PUT /categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Delete category (Admin only)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized - Admins only" }, { status: 403 });
    }

    const db = getConnection();
    await db.query("DELETE FROM categories WHERE id = $1", [params.id]);

    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    console.error("🔥 DELETE /categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
