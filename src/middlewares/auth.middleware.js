import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { query } from "../config/db.js";

export default async function auth(req, res, next) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) return next(ApiError.unauthorized("Authentication required"));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const r = await query("SELECT id, name, email FROM users WHERE id=$1", [
      payload.id,
    ]);
    if (!r.rows.length) return next(ApiError.unauthorized("User not found"));

    req.user = r.rows[0];
    next();
  } catch (err) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }
}
