import { createUser, findUserByEmail } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { createToken } from "../utils/token.js";
import {
  createRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
} from "../models/refresh-token.model.js";
import {
  generateRefreshToken,
  hashRefreshToken,
  getRefreshTokenExpiration,
} from "../utils/refreshToken.js";

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

function setRefreshTokenCookie(res, token) {
  const expireInDays = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7;

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    maxAge: expireInDays * 24 * 60 * 60 * 1000,
    path: "/auth",
  });
}

function clearRefreshTokenCookie(res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: "lax",
    path: "/auth",
  });
}

function issueAuthSession(user, res) {
  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  createRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt: getRefreshTokenExpiration(),
  });

  setRefreshTokenCookie(res, refreshToken);

  return createToken(user);
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedName || !normalizedEmail || typeof password !== "string") {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  if (!validateEmail(normalizedEmail)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const existingUser = findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser(normalizedName, normalizedEmail, passwordHash);
  const accessToken = issueAuthSession(user, res);

  res.status(201).json({
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!normalizedEmail || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = findUserByEmail(normalizedEmail);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const accessToken = issueAuthSession(user, res);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    accessToken,
  });
}

export function me(req, res) {
  return res.status(200).json({ user: publicUser(req.user) });
}

export function refreshToken(req, res) {
  const rawRefreshToken = req.cookies.refreshToken;

  if (!rawRefreshToken) {
    return res.status(401).json({ error: "Refresh token not found" });
  }

  const refreshTokenHash = hashRefreshToken(rawRefreshToken);
  const storedToken = findValidRefreshToken(refreshTokenHash);

  if (!storedToken) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ error: "Invalid refresh token" });
  }

  revokeRefreshToken(refreshTokenHash);

  const user = {
    id: storedToken.user_id,
    name: storedToken.name,
    email: storedToken.email,
  };

  const accessToken = issueAuthSession(user, res);

  return res.status(200).json({
    user: publicUser(user),
    accessToken,
  });
}

export function logout(req, res) {
  const rawRefreshToken = req.cookies.refreshToken;

  if (rawRefreshToken) {
    revokeRefreshToken(hashRefreshToken(rawRefreshToken));
  }

  clearRefreshTokenCookie(res);
  return res.status(200).json({ message: "Logged out successfully" });
}
