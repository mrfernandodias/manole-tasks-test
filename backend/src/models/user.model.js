import db from "../database/db.js";

/**
 * Finds a user by email, including the password hash needed for login.
 *
 * @param {string} email
 * @returns {{ id: number, name: string, email: string, password: string } | undefined}
 */
export function findUserByEmail(email) {
  return db
    .prepare(
      `
      SELECT id, name, email, password
      FROM users
      WHERE email = ?
    `,
    )
    .get(email);
}

/**
 * Creates a new user in the database.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} passwordHash
 * @returns {{ id: number, name: string, email: string }}
 */
export function createUser(name, email, passwordHash) {
  const result = db
    .prepare(
      `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `,
    )
    .run(name, email, passwordHash);

  return {
    id: result.lastInsertRowid,
    name,
    email,
  };
}
