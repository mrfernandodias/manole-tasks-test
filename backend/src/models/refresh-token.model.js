import db from "../database/db.js";

export function createRefreshToken({ userId, tokenHash, expiresAt }) {
  return db
    .prepare(
      `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `,
    )
    .run(userId, tokenHash, expiresAt);
}

export function findValidRefreshToken(tokenHash) {
  return db
    .prepare(
      `
      SELECT
        refresh_tokens.id,
        refresh_tokens.user_id,
        refresh_tokens.expires_at,
        users.name,
        users.email
      FROM refresh_tokens
      INNER JOIN users ON refresh_tokens.user_id = users.id
      WHERE refresh_tokens.token_hash = ?
        AND refresh_tokens.revoked_at IS NULL
        AND refresh_tokens.expires_at > ?
    `,
    )
    .get(tokenHash, Date.now());
}

export function revokeRefreshToken(tokenHash) {
  return db
    .prepare(
      `
    UPDATE refresh_tokens
    SET revoked_at = ?
    WHERE token_hash = ?
  `,
    )
    .run(Date.now(), tokenHash);
}
