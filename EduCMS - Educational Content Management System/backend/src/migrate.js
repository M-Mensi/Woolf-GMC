import "dotenv/config";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

try {
  const schemaPath = new URL("../sql/001_schema.sql", import.meta.url);
  const schema = await readFile(fileURLToPath(schemaPath), "utf8");
  await pool.query(schema);
  console.log("EduCMS database schema is up to date.");
} catch (error) {
  console.error("Database migration failed:", error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
