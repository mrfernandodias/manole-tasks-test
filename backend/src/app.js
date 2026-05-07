import express from "express";
import cors from "cors";
import "./database/db.js";

import authRouter from "./routes/auth.routes.js";
import { authenticate } from "./middlewares/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.use("/auth", authRouter);

export default app;
