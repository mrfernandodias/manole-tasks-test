import { createUser, findUserByEmail } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { createToken } from "../utils/token.js";

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email and password are required" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = findUserByEmail(normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: "Email is already registered" });
  }

  const passwordHash = await hashPassword(password);
  const user = createUser(name, normalizedEmail, passwordHash);
  const token = createToken(user);

  res
    .status(201)
    .json({ user: { id: user.id, name: user.name, email: user.email }, token });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = findUserByEmail(normalizedEmail);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = createToken(user);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}
