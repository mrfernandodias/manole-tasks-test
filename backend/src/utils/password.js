import bcrypt from "bcryptjs";

/**
 * Creates a bcrypt hash from a plain-text password.
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plain-text password with a bcrypt hash.
 *
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
