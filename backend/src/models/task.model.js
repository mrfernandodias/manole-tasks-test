import db from "../database/db.js";

/**
 * Creates a task for a user and returns the persisted record.
 *
 * @param {{ userId: number, title: string, description: string | null, status: "pendente" | "em andamento" | "concluída" }} task
 * @returns {{ id: number, title: string, description: string | null, status: string, created_at: string } | undefined}
 */
export function createTask({ userId, title, description, status }) {
  const result = db
    .prepare(
      `INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)`,
    )
    .run(userId, title, description, status);

  return findTaskById({ id: result.lastInsertRowid, userId });
}

/**
 * Lists tasks owned by a user with optional status filtering and pagination.
 *
 * @param {{ userId: number, status?: string, page: number, limit: number }} filters
 * @returns {{ data: Array<{ id: number, title: string, description: string | null, status: string, created_at: string }>, meta: { page: number, limit: number, total: number, totalPages: number } }}
 */
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

/**
 * Finds a task by id, scoped to its owner.
 *
 * @param {{ id: number, userId: number }} params
 * @returns {{ id: number, title: string, description: string | null, status: string, created_at: string } | undefined}
 */
export function findTaskById({ id, userId }) {
  return db
    .prepare(
      `SELECT id, title, description, status, created_at FROM tasks WHERE id = ? AND user_id = ?`,
    )
    .get(id, userId);
}

/**
 * Updates a task owned by a user and returns the updated record.
 *
 * @param {{ id: number, userId: number, title: string, description: string | null, status: "pendente" | "em andamento" | "concluída" }} task
 * @returns {{ id: number, title: string, description: string | null, status: string, created_at: string } | undefined}
 */
export function updateTask({ id, userId, title, description, status }) {
  db.prepare(
    `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?`,
  ).run(title, description || null, status, id, userId);

  return findTaskById({ id, userId });
}

/**
 * Deletes a task scoped to its owner.
 *
 * @param {{ id: number, userId: number }} params
 * @returns {boolean} True when a task was deleted.
 */
export function deleteTask({ id, userId }) {
  const result = db
    .prepare(`DELETE FROM tasks WHERE id = ? AND user_id = ?`)
    .run(id, userId);

  return result.changes > 0;
}
