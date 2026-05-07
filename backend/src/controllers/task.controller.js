import {
  createTask,
  listTasks,
  findTaskById,
  updateTask,
  deleteTask,
} from "../models/task.model.js";

const VALID_STATUSES = ["pendente", "em andamento", "concluída"];

function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

function normalizePagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  return { page, limit };
}

function normalizeDescription(description) {
  if (typeof description !== "string") return null;

  const trimmedDescription = description.trim();
  return trimmedDescription.length > 0 ? trimmedDescription : null;
}

export function index(req, res) {
  const { status } = req.query;

  if (status && !isValidStatus(status)) {
    return res.status(400).json({ error: "Invalid status filter" });
  }

  const { page, limit } = normalizePagination(req.query);

  const result = listTasks({
    userId: req.user.id,
    status,
    page,
    limit,
  });

  return res.status(200).json(result);
}

export function show(req, res) {
  const task = findTaskById({ id: req.params.id, userId: req.user.id });

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(200).json({ data: task });
}

export function store(req, res) {
  const { title, description, status = "pendente" } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }

  if (!isValidStatus(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const task = createTask({
    userId: req.user.id,
    title: title.trim(),
    description: normalizeDescription(description),
    status,
  });

  return res.status(201).json({
    data: task,
    message: "Task created successfully",
  });
}

export function update(req, res) {
  const { title, description, status } = req.body;

  const existingTask = findTaskById({ id: req.params.id, userId: req.user.id });

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    return res.status(400).json({ error: "Title must be a non-empty string" });
  }

  if (status !== undefined && !isValidStatus(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const task = updateTask({
    id: req.params.id,
    userId: req.user.id,
    title: title ? title.trim() : existingTask.title,
    description:
      description !== undefined
        ? normalizeDescription(description)
        : existingTask.description,
    status: status || existingTask.status,
  });

  return res.status(200).json({
    data: task,
    message: "Task updated successfully",
  });
}

export function destroy(req, res) {
  const deleted = deleteTask({
    id: Number(req.params.id),
    userId: req.user.id,
  });

  if (!deleted) {
    return res.status(404).json({ error: "Task not found" });
  }

  return res.status(200).json({ message: "Task deleted successfully" });
}
