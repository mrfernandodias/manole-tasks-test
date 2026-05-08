import { apiRequest } from "./api";
import type {
  CreateTaskPayload,
  DeleteTaskResponse,
  Task,
  TaskApi,
  TaskApiResponse,
  TaskListApiResponse,
  TaskListParams,
  TaskListResponse,
  UpdateTaskPayload,
} from "../types/task";

function mapTaskFromApi(task: TaskApi): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.created_at,
  };
}

function buildTaskQueryParams(params: TaskListParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) {
    searchParams.set("page", String(params.page));
  }

  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params.status && params.status !== "all") {
    searchParams.set("status", params.status);
  }

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

export async function listTasks(
  accessToken: string,
  params: TaskListParams = {},
): Promise<TaskListResponse> {
  const queryString = buildTaskQueryParams(params);

  const response = await apiRequest<TaskListApiResponse>(
    `/tasks${queryString}`,
    {
      method: "GET",
      token: accessToken,
    },
  );

  return {
    tasks: response.data.map(mapTaskFromApi),
    meta: response.meta,
  };
}

export async function getTaskById(
  accessToken: string,
  taskId: number,
): Promise<Task> {
  const response = await apiRequest<TaskApiResponse>(`/tasks/${taskId}`, {
    method: "GET",
    token: accessToken,
  });

  return mapTaskFromApi(response.data);
}

export async function createTask(
  accessToken: string,
  payload: CreateTaskPayload,
): Promise<Task> {
  const response = await apiRequest<TaskApiResponse>("/tasks", {
    method: "POST",
    token: accessToken,
    body: JSON.stringify(payload),
  });

  return mapTaskFromApi(response.data);
}

export async function updateTask(
  accessToken: string,
  taskId: number,
  payload: UpdateTaskPayload,
): Promise<Task> {
  const response = await apiRequest<TaskApiResponse>(`/tasks/${taskId}`, {
    method: "PUT",
    token: accessToken,
    body: JSON.stringify(payload),
  });

  return mapTaskFromApi(response.data);
}

export async function deleteTask(
  accessToken: string,
  taskId: number,
): Promise<void> {
  await apiRequest<DeleteTaskResponse>(`/tasks/${taskId}`, {
    method: "DELETE",
    token: accessToken,
  });
}
