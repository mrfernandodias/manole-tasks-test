import { useCallback, useEffect, useState } from "react";
import { LogOut, Plus, Sparkles } from "lucide-react";

import { Toast } from "../../../components/Toast";
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
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { TaskCard } from "../components/TaskCard";
import { TaskCreateForm } from "../components/TaskCreateForm";
import { TaskFilters } from "../components/TaskFilters";
import { TaskPagination } from "../components/TaskPagination";

const PAGE_LIMIT = 10;

export function TasksPage() {
  const { user, accessToken, signOut } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [meta, setMeta] = useState<TaskMeta | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);

  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(
    null,
  );

  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });

      window.setTimeout(() => {
        setToast(null);
      }, 3000);
    },
    [],
  );

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
          search: searchTerm,
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
          showToast("error", message);
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
  }, [accessToken, page, statusFilter, searchTerm, reloadKey, showToast]);

  function handleChangeStatusFilter(status: TaskStatus | "all") {
    setStatusFilter(status);
    setPage(1);
  }

  function handleSearch(search: string) {
    setSearchTerm(search.trim());
    setPage(1);
  }

  function handleRefreshTasks() {
    setReloadKey((currentValue) => currentValue + 1);
  }

  function handlePreviousPage() {
    setPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function handleNextPage() {
    if (!meta) {
      return;
    }

    setPage((currentPage) => Math.min(currentPage + 1, meta.totalPages));
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
      setSearchTerm("");
      setPage(1);
      setReloadKey((currentValue) => currentValue + 1);
      showToast("success", "Tarefa criada com sucesso.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Não foi possível criar a tarefa.";

      setError(message);
      showToast("error", message);

      throw err;
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
      showToast("error", message);
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

      setError(message);
      showToast("error", message);
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

        <TaskFilters
          statusFilter={statusFilter}
          searchTerm={searchTerm}
          meta={meta}
          onChangeStatusFilter={handleChangeStatusFilter}
          onSearch={handleSearch}
          onRefresh={handleRefreshTasks}
        />

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
              Crie sua primeira tarefa ou ajuste os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isUpdating={updatingTaskId === task.id}
                isDeleting={deletingTaskId === task.id}
                onChangeStatus={handleUpdateTaskStatus}
                onDelete={setTaskPendingDeletion}
              />
            ))}
          </div>
        )}

        <TaskPagination
          meta={meta}
          canGoToPreviousPage={canGoToPreviousPage}
          canGoToNextPage={canGoToNextPage}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
        />
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
