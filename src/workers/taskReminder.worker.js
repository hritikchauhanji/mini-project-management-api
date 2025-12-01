import cron from "node-cron";
import { query } from "../config/db.js";

async function checkDueTasks() {
  try {
    console.log("[Worker] Checking tasks with due_date = tomorrow...");

    const result = await query(
      `
      SELECT 
        t.id,
        t.title,
        t.due_date,
        u.name AS assigned_user,
        u.email
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE t.due_date = CURRENT_DATE + INTERVAL '1 day'
      ORDER BY t.due_date ASC
      `
    );

    if (result.rows.length === 0) {
      console.log("No tasks are due tomorrow.");
      return;
    }

    result.rows.forEach((task) => {
      console.log(
        `Reminder: Task "${task.title}" is due tomorrow (${task.due_date}). Assigned to: ${task.assigned_user} (${task.email})`
      );
    });
  } catch (err) {
    console.error("[Worker Error]:", err.message);
  }
}

// cron.schedule("0 9 * * *", checkDueTasks);
// FOR TESTING → runs every 10 seconds
cron.schedule("*/10 * * * * *", checkDueTasks);

console.log("Task Reminder Worker Started...");
