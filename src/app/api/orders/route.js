import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

// ✅ Get orders (all or by status)
export async function GET(req) {
  try {
    const db = getConnection();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let query = "SELECT * FROM orders ORDER BY created_at DESC";
    let values = [];

    if (status && status !== "all") {
      query = "SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC";
      values = [status];
    }

    const result = await db.query(query, values);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("🔥 GET /orders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✅ Update order status
export async function PUT(req) {
  try {
    const db = getConnection();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }

    // ✅ Allowed statuses (match DB constraint)
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const query = "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *";
    const result = await db.query(query, [status, orderId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Order status updated successfully",
      order: result.rows[0],
    });
  } catch (err) {
    console.error("🔥 PUT /orders error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
