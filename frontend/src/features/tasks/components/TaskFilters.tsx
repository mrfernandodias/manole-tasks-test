import { RefreshCcw, Search, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import type { TaskMeta, TaskStatus } from "../../../types/task";

type TaskFiltersProps = {
  statusFilter: TaskStatus | "all";
  searchTerm: string;
  meta: TaskMeta | null;
  onChangeStatusFilter: (status: TaskStatus | "all") => void;
  onSearch: (search: string) => void;
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
  searchTerm,
  meta,
  onChangeStatusFilter,
  onSearch,
  onRefresh,
}: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(searchInput);
  }

  function handleClearSearch() {
    setSearchInput("");
    onSearch("");
  }

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Buscar por título ou descrição"
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:flex-none"
            >
              Buscar
            </button>

            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Limpar
              </button>
            )}
          </div>
        </form>
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
            {searchTerm && (
              <>
                {" "}
                para{" "}
                <span className="font-medium text-slate-700">
                  “{searchTerm}”
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
