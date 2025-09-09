import { getConnection } from "@/lib/db";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession({ req, ...authOptions });

    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
      });
    }

    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields required" }), {
        status: 400,
      });
    }

    const db = getConnection();

    // ✅ Check if user exists
    const existingResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingResult.rows.length > 0) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // ✅ Hash password
    const hashedPassword = await hash(password, 10);

    // ✅ Insert new admin
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, "admin"]
    );

    return new Response(JSON.stringify({ message: "Admin added successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("🔥 API Error /api/admin/add:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
