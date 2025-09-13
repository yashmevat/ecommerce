import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // adjust path if needed
import { getConnection } from "../../../../lib/db";
import { NextResponse } from "next/server";

// ✅ Get all categories
export async function GET() {
  try {
    const db = getConnection();
    const result = await db.query("SELECT * FROM categories ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("🔥 GET /categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Create new category
export async function POST(req) {
  try {
    // 🔑 Get user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔎 Check role
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admins only" }, { status: 403 });
    }

    const { name, description } = await req.json();
    if (!name || !description) {
      return NextResponse.json(
        { error: "Category name and description required" },
        { status: 400 }
      );
    }

    const db = getConnection();
    await db.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [
      name,
      description,
    ]);

    return NextResponse.json({ message: "Category created" }, { status: 201 });
  } catch (error) {
    console.error("🔥 POST /categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}