import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./database/db.js";

import authRouter from "./routes/auth.routes.js";
import tasksRouter from "./routes/tasks.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

export default app;
