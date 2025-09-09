import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ Get all categories
export async function GET() {
  const db = await getConnection();
  const [rows] = await db.execute("SELECT * FROM categories ORDER BY id DESC");
  return NextResponse.json(rows);
}

// ✅ Create new category
export async function POST(req) {
  const { name } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Category name required" }, { status: 400 });
  }

  const db = await getConnection();
  await db.execute("INSERT INTO categories (name) VALUES (?)", [name]);

  return NextResponse.json({ message: "Category created" }, { status: 201 });
}
