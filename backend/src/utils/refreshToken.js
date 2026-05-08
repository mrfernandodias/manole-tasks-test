import crypto from "node:crypto";

export function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getRefreshTokenExpiration() {
  const expireInDays = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

  return Date.now() + expireInDays * 24 * 60 * 60 * 1000;
}
