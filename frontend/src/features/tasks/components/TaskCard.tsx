import { Trash2 } from "lucide-react";

import type { Task, TaskStatus } from "../../../types/task";

type TaskCardProps = {
  task: Task;
  isUpdating: boolean;
  isDeleting: boolean;
  onChangeStatus: (taskId: number, status: TaskStatus) => void;
  onDelete: (task: Task) => void;
};

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

export function TaskCard({
  task,
  isUpdating,
  isDeleting,
  onChangeStatus,
  onDelete,
}: TaskCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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

          <h3 className="text-lg font-bold text-slate-950">{task.title}</h3>

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
              disabled={isUpdating || isDeleting}
              onChange={(event) =>
                onChangeStatus(task.id, event.target.value as TaskStatus)
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
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 lg:w-44"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </article>
  );
}
