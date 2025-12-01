import jwt from "jsonwebtoken";
import { query } from "../config/db.js";

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header)
    return res
      .status(401)
      .json({ status: "error", message: "Missing Authorization header" });
  const parts = header.split(" ");
  if (parts.length !== 2)
    return res
      .status(401)
      .json({ status: "error", message: "Invalid Authorization header" });

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const r = await query("SELECT id, name, email FROM users WHERE id=$1", [
      payload.id,
    ]);
    if (!r.rows.length)
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token user" });
    req.user = r.rows[0];
    return next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
}
