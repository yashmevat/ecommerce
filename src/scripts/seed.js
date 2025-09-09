// seed-admin.js
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "ecommerce",
  });

  const email = "admin@example.com";
  const plainPassword = "admin123"; // 👈 apna password yaha change karo
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // check if admin already exists
  const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

  if (rows.length > 0) {
    console.log("⚠️ Admin user already exists:", rows[0].email);
  } else {
    await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin User", email, hashedPassword, "admin"]
    );
    console.log("✅ Admin user created:", email);
  }

  await connection.end();
}

seedAdmin().catch((err) => {
  console.error("❌ Error seeding admin:", err);
  process.exit(1);
});
