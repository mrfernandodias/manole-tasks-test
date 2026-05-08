import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import type { CreateTaskPayload, TaskStatus } from "../../../types/task";

type TaskCreateFormProps = {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
};

const statusOptions: Array<{ label: string; value: TaskStatus }> = [
  { label: "Pendente", value: "pendente" },
  { label: "Em andamento", value: "em andamento" },
  { label: "Concluída", value: "concluída" },
];

export function TaskCreateForm({
  isSubmitting,
  onCancel,
  onSubmit,
}: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pendente");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      title,
      description,
      status,
    });

    setTitle("");
    setDescription("");
    setStatus("pendente");
  }

  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Nova tarefa</h3>
          <p className="mt-1 text-sm text-slate-500">
            Preencha as informações abaixo para cadastrar uma tarefa.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Fechar formulário"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label
            htmlFor="task-title"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Título
          </label>

          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Finalizar tela de tarefas"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Descrição
          </label>

          <textarea
            id="task-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Detalhe rapidamente o que precisa ser feito"
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
        </div>

        <div>
          <label
            htmlFor="task-status"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="task-status"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Salvando..." : "Salvar tarefa"}
          </button>
        </div>
      </form>
    </div>
  );
}
