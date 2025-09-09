import pkg from "pg";
const { Pool } = pkg;

let pool;

export async function getConnection() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL, // Neon connection string
      ssl: {
        rejectUnauthorized: false, // required for Neon
      },
    });
  }
  return pool;
}
