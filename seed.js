import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
console.log('DATABASE_URL:', process.env.DATABASE_URL);

import { getConnection } from "./src/lib/db.js";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  const db = await getConnection();

  const email = "admin@example.com";
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (result.rows.length > 0) {
    console.log("⚠️ Admin already exists:", result.rows[0].email);
  } else {
    await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      ["Admin User", email, hashedPassword, "admin"]
    );
    console.log("✅ Admin created:", email);
  }

  await db.end(); // close connection after script
}

seedAdmin();
