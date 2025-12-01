import fs from "fs";
import path from "path";
import { query } from "../src/config/db.js";

async function migrate() {
  try {
    const filePath = path.resolve("migrations.sql");
    const sql = fs.readFileSync(filePath, "utf-8");

    console.log("Running migrations on:", process.env.DATABASE_URL);
    await query(sql);

    console.log("Migrations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
