import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  // Example: test DB connection
  try {
    await sql`SELECT 1`;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed", err);
    throw err;
  }
}
