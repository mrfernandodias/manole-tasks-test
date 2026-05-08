import { CheckCircle2, XCircle } from "lucide-react";

type ToastProps = {
  type?: "success" | "error";
  message: string;
  onClose: () => void;
};

export function Toast({ type = "success", message, onClose }: ToastProps) {
  const isSuccess = type === "success";

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-white/10 bg-slate-950 p-4 text-white shadow-2xl shadow-slate-950/30">
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 ${
            isSuccess ? "text-emerald-300" : "text-red-300"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold">
            {isSuccess ? "Tudo certo" : "Atenção"}
          </p>
          <p className="mt-1 text-sm text-slate-300">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Fechar aviso"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
