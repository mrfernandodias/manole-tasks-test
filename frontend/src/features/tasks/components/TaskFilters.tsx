import { RefreshCcw } from "lucide-react";

import type { TaskMeta, TaskStatus } from "../../../types/task";

type TaskFiltersProps = {
  statusFilter: TaskStatus | "all";
  meta: TaskMeta | null;
  onChangeStatusFilter: (status: TaskStatus | "all") => void;
  onRefresh: () => void;
};

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

export function TaskFilters({
  statusFilter,
  meta,
  onChangeStatusFilter,
  onRefresh,
}: TaskFiltersProps) {
  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const isActive = statusFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChangeStatusFilter(option.value)}
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
          onClick={onRefresh}
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
  );
}
