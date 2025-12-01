import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import { query } from "../config/db.js";

export async function register({ name, email, password }) {
  const exists = await query("SELECT id FROM users WHERE email=$1", [email]);
  if (exists.rows.length) throw ApiError.conflict("Email already exists");

  const hash = await bcrypt.hash(password, 10);

  const result = await query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1,$2,$3)
     RETURNING id, name, email, created_at`,
    [name, email, hash]
  );

  const user = result.rows[0];

  return { user };
}

export async function login({ email, password }) {
  const r = await query("SELECT * FROM users WHERE email=$1", [email]);
  if (!r.rows.length) throw ApiError.unauthorized("Invalid credentials");

  const user = r.rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw ApiError.unauthorized("Invalid credentials");

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  delete user.password_hash;

  return { user, token };
}
