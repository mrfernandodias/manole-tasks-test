export type TaskStatus = "pendente" | "em andamento" | "concluída";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
};

export type TaskApi = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
};

export type TaskListParams = {
  page?: number;
  limit?: number;
  status?: TaskStatus | "all";
  search?: string;
};

export type TaskMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TaskListApiResponse = {
  data: TaskApi[];
  meta: TaskMeta;
};

export type TaskListResponse = {
  tasks: Task[];
  meta: TaskMeta;
};

export type TaskApiResponse = {
  data: TaskApi;
  message?: string;
};

export type DeleteTaskResponse = {
  message: string;
};

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};
