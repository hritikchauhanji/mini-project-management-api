import ApiError from "../utils/apiError.js";
import { query } from "../config/db.js";

export async function createProject(data, user) {
  const ownerId = data.owner_id || user.id;

  const owner = await query("SELECT id FROM users WHERE id=$1", [ownerId]);
  if (owner.rows.length === 0) {
    throw ApiError.unprocessable("Owner does not exist");
  }

  const result = await query(
    `INSERT INTO projects (name, description, owner_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, description, owner_id, created_at`,
    [data.name, data.description || null, ownerId]
  );

  return result.rows[0];
}

export async function listProjects() {
  const result = await query(
    `
    SELECT 
      p.*, 
      u.name AS owner_name,
      u.email AS owner_email
    FROM projects p
    LEFT JOIN users u ON u.id = p.owner_id
    ORDER BY p.created_at DESC
    `
  );

  return result.rows;
}
