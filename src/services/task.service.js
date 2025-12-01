import ApiError from "../utils/apiError.js";
import { query } from "../config/db.js";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
});

function makeCacheKey(obj) {
  return `tasks:${obj.project_id || ""}:${obj.status || ""}:${
    obj.assigned_to || ""
  }:p${obj.page || 1}:l${obj.limit || 10}`;
}

export async function createTask(data) {
  const p = await query("SELECT id FROM projects WHERE id=$1", [
    data.project_id,
  ]);
  if (!p.rows.length) throw ApiError.badRequest("Project not found");

  if (data.assigned_to) {
    const u = await query("SELECT id FROM users WHERE id=$1", [
      data.assigned_to,
    ]);
    if (!u.rows.length) throw ApiError.badRequest("Assigned user not found");
  }

  const r = await query(
    `INSERT INTO tasks (project_id, title, description, assigned_to)
     VALUES ($1,$2,$3,$4)
     RETURNING id, project_id, title, description, status, assigned_to, created_at`,
    [
      data.project_id,
      data.title,
      data.description || null,
      data.assigned_to || null,
    ]
  );

  await redis.flushall();

  return r.rows[0];
}

export async function addComment(taskId, { user_id, message }) {
  const t = await query("SELECT id FROM tasks WHERE id=$1", [taskId]);
  if (!t.rows.length) throw ApiError.notFound("Task not found");

  const u = await query("SELECT id FROM users WHERE id=$1", [user_id]);
  if (!u.rows.length) throw ApiError.badRequest("User not found");

  const r = await query(
    `INSERT INTO comments (task_id, user_id, message)
     VALUES ($1, $2, $3)
     RETURNING id, task_id, user_id, message, created_at`,
    [taskId, user_id, message]
  );

  await redis.flushall();

  return r.rows[0];
}

export async function listTasks({
  project_id,
  status,
  assigned_to,
  page = 1,
  limit = 10,
}) {
  const p = Number(page) || 1;
  const l = Math.min(Number(limit) || 10, 100);
  const offset = (p - 1) * l;

  const cacheKey = makeCacheKey({
    project_id,
    status,
    assigned_to,
    page: p,
    limit: l,
  });
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const filters = [];
  const vals = [];
  let idx = 1;

  if (project_id) {
    filters.push(`t.project_id = $${idx++}`);
    vals.push(project_id);
  }
  if (status) {
    filters.push(`t.status = $${idx++}`);
    vals.push(status);
  }
  if (assigned_to) {
    filters.push(`t.assigned_to = $${idx++}`);
    vals.push(assigned_to);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*)::int as total FROM tasks t ${where}`;
  const countRes = await query(countSql, vals);
  const total = Number(countRes.rows[0].total);

  vals.push(l, offset);

  const sql = `
    SELECT
      t.id,
      t.title,
      t.description,
      t.status,
      t.created_at,
      t.project_id,
      p.name AS project_name,
      p.description AS project_description,
      u.id AS assigned_id,
      u.name AS assigned_name,
      u.email AS assigned_email,
      c.latest_message,
      c.latest_user_id,
      c.latest_created_at
    FROM tasks t
    LEFT JOIN projects p ON p.id = t.project_id
    LEFT JOIN users u ON u.id = t.assigned_to
    LEFT JOIN (
      SELECT task_id,
             (array_agg(message ORDER BY created_at DESC))[1] AS latest_message,
             (array_agg(user_id ORDER BY created_at DESC))[1] AS latest_user_id,
             (array_agg(created_at ORDER BY created_at DESC))[1] AS latest_created_at
      FROM comments
      GROUP BY task_id
    ) c ON c.task_id = t.id
    ${where}
    ORDER BY t.created_at DESC
    LIMIT $${idx++} OFFSET $${idx}
  `;

  const res = await query(sql, vals);

  const response = {
    total,
    page: p,
    limit: l,
    tasks: res.rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      created_at: r.created_at,
      project: {
        id: r.project_id,
        name: r.project_name,
        description: r.project_description,
      },
      assigned_to: r.assigned_id
        ? {
            id: r.assigned_id,
            name: r.assigned_name,
            email: r.assigned_email,
          }
        : null,
      latest_comment: r.latest_message
        ? {
            message: r.latest_message,
            user_id: r.latest_user_id,
            created_at: r.latest_created_at,
          }
        : null,
    })),
  };

  await redis.set(cacheKey, JSON.stringify(response), "EX", 30);

  return response;
}

export async function updateTask(id, data) {
  if (data.assigned_to !== undefined && data.assigned_to !== null) {
    const u = await query("SELECT id FROM users WHERE id=$1", [
      data.assigned_to,
    ]);
    if (!u.rows.length) throw ApiError.badRequest("Assigned user not found");
  }

  const allowed = ["title", "description", "status", "assigned_to"];
  const updates = [];
  const vals = [];
  let idx = 1;

  for (const key of allowed) {
    if (data[key] !== undefined) {
      updates.push(`${key} = $${idx++}`);
      vals.push(data[key]);
    }
  }

  if (!updates.length) throw ApiError.badRequest("No fields to update");

  vals.push(id);
  const sql = `UPDATE tasks SET ${updates.join(
    ", "
  )} WHERE id = $${idx} RETURNING *`;
  const r = await query(sql, vals);

  if (!r.rows.length) throw ApiError.notFound("Task not found");

  await redis.flushall();

  return r.rows[0];
}
