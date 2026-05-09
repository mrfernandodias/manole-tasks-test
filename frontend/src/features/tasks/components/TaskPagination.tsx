import type { TaskMeta } from "../../../types/task";

type TaskPaginationProps = {
  meta: TaskMeta | null;
  canGoToPreviousPage: boolean;
  canGoToNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

export function TaskPagination({
  meta,
  canGoToPreviousPage,
  canGoToNextPage,
  onPreviousPage,
  onNextPage,
}: TaskPaginationProps) {
  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Página {meta.page} de {meta.totalPages} · {meta.total} tarefa(s)
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={!canGoToPreviousPage}
          onClick={onPreviousPage}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>

        <button
          type="button"
          disabled={!canGoToNextPage}
          onClick={onNextPage}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
