// import mysql from "mysql2/promise";

// let connection;

// export async function getConnection() {
//   if (!connection) {
//     connection = await mysql.createPool({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASS,
//       database: process.env.DB_NAME,
//       waitForConnections: true,
//       connectionLimit: 10,
//       queueLimit: 0,
//     });
//   }
//   return connection;
// }



import pkg from "pg";
const { Pool } = pkg;

// Singleton pool instance
let pool;

export function getConnection() {
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
