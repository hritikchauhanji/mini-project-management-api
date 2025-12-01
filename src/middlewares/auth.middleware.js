import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { query } from "../config/db.js";

export default async function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header)
    return next(ApiError.unauthorized("Missing Authorization header"));

  const parts = header.split(" ");
  if (parts.length !== 2)
    return next(ApiError.unauthorized("Invalid token format"));

  const token = parts[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const r = await query("SELECT id, name, email FROM users WHERE id=$1", [
      payload.id,
    ]);

    if (!r.rows.length) return next(ApiError.unauthorized("User not found"));

    req.user = r.rows[0];

    return next();
  } catch (err) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
}
