import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { query } from "./config/db.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
  try {
    const r = await query("SELECT NOW()");
    console.log("DB connected:", r.rows[0].now);
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
});
