import { useEffect, useState } from "react";
import { LogOut, Plus, RefreshCcw, Sparkles, Trash2 } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} from "../../../services/taskService";
import type {
  CreateTaskPayload,
  Task,
  TaskMeta,
  TaskStatus,
} from "../../../types/task";
import { TaskCreateForm } from "../components/TaskCreateForm";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { Toast } from "../../../components/Toast";

const PAGE_LIMIT = 10;

const statusOptions: Array<{ label: string; value: TaskStatus | "all" }> = [
  { label: "Todas", value: "all" },
  { label: "Pendentes", value: "pendente" },
  { label: "Em andamento", value: "em andamento" },
  { label: "Concluídas", value: "concluída" },
];

function getStatusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    pendente: "Pendente",
    "em andamento": "Em andamento",
    concluída: "Concluída",
  };

  return labels[status];
}

function getStatusClassName(status: TaskStatus) {
  const classes: Record<TaskStatus, string> = {
    pendente: "bg-amber-50 text-amber-700 border-amber-100",
    "em andamento": "bg-blue-50 text-blue-700 border-blue-100",
    concluída: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return classes[status];
}

function formatDate(date: string) {
  const normalizedDate = date.replace(" ", "T");
  const parsedDate = new Date(normalizedDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsedDate);
}

export function TasksPage() {
  const { user, accessToken, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<TaskMeta | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(
    null,
  );
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    let shouldIgnoreResponse = false;

    async function fetchTasks() {
      if (!accessToken) {
        setIsLoadingTasks(false);
        return;
      }

      setIsLoadingTasks(true);
      setError(null);

      try {
        const response = await listTasks(accessToken, {
          page,
          limit: PAGE_LIMIT,
          status: statusFilter,
        });

        if (!shouldIgnoreResponse) {
          setTasks(response.tasks);
          setMeta(response.meta);
        }
      } catch (err) {
        if (!shouldIgnoreResponse) {
          const message =
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as tarefas.";

          setError(message);
        }
      } finally {
        if (!shouldIgnoreResponse) {
          setIsLoadingTasks(false);
        }
      }
    }

    fetchTasks();

    return () => {
      shouldIgnoreResponse = true;
    };
  }, [accessToken, page, statusFilter, reloadKey]);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function handleChangeStatusFilter(status: TaskStatus | "all") {
    setStatusFilter(status);
    setPage(1);
  }

  function handleRefreshTasks() {
    setReloadKey((currentValue) => currentValue + 1);
  }

  async function handleCreateTask(payload: CreateTaskPayload) {
    if (!accessToken) {
      return;
    }

    setIsCreatingTask(true);
    setError(null);

    try {
      await createTask(accessToken, payload);

      setIsCreateFormOpen(false);
      setStatusFilter("all");
      setPage(1);
      setReloadKey((currentValue) => currentValue + 1);
      showToast("success", "Tarefa criada com sucesso.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível criar a tarefa.";

      setError(message);
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleUpdateTaskStatus(taskId: number, status: TaskStatus) {
    if (!accessToken) {
      return;
    }

    setUpdatingTaskId(taskId);
    setError(null);

    try {
      await updateTask(accessToken, taskId, { status });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, status } : task,
        ),
      );
      showToast("success", "Status atualizado com sucesso.");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o status da tarefa.";

      setError(message);
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (!accessToken) {
      return;
    }

    setDeletingTaskId(taskId);
    setError(null);

    try {
      await deleteTask(accessToken, taskId);

      setTaskPendingDeletion(null);
      showToast("success", "Tarefa excluída com sucesso.");

      if (tasks.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
        return;
      }

      setReloadKey((currentValue) => currentValue + 1);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a tarefa.";

      showToast("error", message);
      setError(message);
    } finally {
      setDeletingTaskId(null);
    }
  }

  const hasTasks = tasks.length > 0;
  const canGoToPreviousPage = page > 1;
  const canGoToNextPage = meta ? page < meta.totalPages : false;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm text-cyan-300">Manole Tasks</p>
            <h1 className="text-xl font-bold">Minhas tarefas</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="bg-slate-950 px-4 pb-14 pt-6 text-white sm:px-6 sm:pb-16 sm:pt-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              Workspace de produtividade
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Painel de tarefas
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Organize suas entregas, acompanhe o andamento e mantenha o fluxo
              de trabalho claro do início ao fim.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            Nova tarefa
          </button>
        </div>
      </section>

      <section className="mx-auto -mt-10 max-w-6xl px-4 pb-10 sm:px-6">
        {isCreateFormOpen && (
          <TaskCreateForm
            isSubmitting={isCreatingTask}
            onCancel={() => setIsCreateFormOpen(false)}
            onSubmit={handleCreateTask}
          />
        )}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => {
                const isActive = statusFilter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChangeStatusFilter(option.value)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-cyan-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleRefreshTasks}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCcw className="h-4 w-4" />
              Atualizar
            </button>
          </div>

          {meta && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="text-sm text-slate-500">
                {meta.total} tarefa(s) encontrada(s)
                {statusFilter !== "all" && (
                  <>
                    {" "}
                    com status{" "}
                    <span className="font-medium text-slate-700">
                      {getStatusLabel(statusFilter)}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoadingTasks ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-slate-500">Carregando tarefas...</p>
          </div>
        ) : !hasTasks ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="text-base font-semibold text-slate-800">
              Nenhuma tarefa encontrada
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Crie sua primeira tarefa ou altere o filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <article
                key={task.id}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_180px] lg:items-start">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
                          task.status,
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>

                      <span className="text-xs text-slate-400">
                        Criada em {formatDate(task.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-950">
                      {task.title}
                    </h3>

                    {task.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        {task.description}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm italic text-slate-400">
                        Sem descrição informada.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end">
                    <div className="w-full lg:w-44">
                      <label
                        htmlFor={`task-status-${task.id}`}
                        className="mb-1 block text-xs font-medium text-slate-500"
                      >
                        Alterar status
                      </label>

                      <select
                        id={`task-status-${task.id}`}
                        value={task.status}
                        disabled={
                          updatingTaskId === task.id ||
                          deletingTaskId === task.id
                        }
                        onChange={(event) =>
                          handleUpdateTaskStatus(
                            task.id,
                            event.target.value as TaskStatus,
                          )
                        }
                        className={`w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:opacity-60 ${getStatusClassName(
                          task.status,
                        )}`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="em andamento">Em andamento</option>
                        <option value="concluída">Concluída</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTaskPendingDeletion(task)}
                      disabled={deletingTaskId === task.id}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 lg:w-44"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingTaskId === task.id ? "Excluindo..." : "Excluir"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Página {meta.page} de {meta.totalPages} · {meta.total} tarefa(s)
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!canGoToPreviousPage}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={!canGoToNextPage}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </section>
      {taskPendingDeletion && (
        <DeleteConfirmDialog
          taskTitle={taskPendingDeletion.title}
          isDeleting={deletingTaskId === taskPendingDeletion.id}
          onCancel={() => setTaskPendingDeletion(null)}
          onConfirm={() => handleDeleteTask(taskPendingDeletion.id)}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
