import db from "../database/db.js";

export function createTask({ userId, title, description, status }) {
  const result = db
    .prepare(
      `INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)`,
    )
    .run(userId, title, description, status);

  return findTaskById({ id: result.lastInsertRowid, userId });
}

export function listTasks({ userId, status, page, limit }) {
  const offset = (page - 1) * limit;

  const filters = ["user_id = ?"];
  const params = [userId];

  if (status) {
    filters.push("status = ?");
    params.push(status);
  }

  const whereClause = filters.join(" AND ");

  const tasks = db
    .prepare(
      `SELECT id, title, description, status, created_at FROM tasks WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, limit, offset);

  const total = db
    .prepare(`SELECT COUNT(*) as count FROM tasks WHERE ${whereClause}`)
    .get(...params).count;

  return {
    data: tasks,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function findTaskById({ id, userId }) {
  return db
    .prepare(
      `SELECT id, title, description, status, created_at FROM tasks WHERE id = ? AND user_id = ?`,
    )
    .get(id, userId);
}

export function updateTask({ id, userId, title, description, status }) {
  db.prepare(
    `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?`,
  ).run(title, description || null, status, id, userId);

  return findTaskById({ id, userId });
}

export function deleteTask({ id, userId }) {
  const result = db
    .prepare(`DELETE FROM tasks WHERE id = ? AND user_id = ?`)
    .run(id, userId);

  return result.changes > 0;
}
