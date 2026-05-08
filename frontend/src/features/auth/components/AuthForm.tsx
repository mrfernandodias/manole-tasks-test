import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../../context/AuthContext";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { error, signIn, signUp, clearError } = useAuth();

  const isRegisterMode = mode === "register";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    clearError();

    try {
      if (isRegisterMode) {
        await signUp({
          name,
          email,
          password,
        });

        return;
      }

      await signIn({
        email,
        password,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-2xl shadow-cyan-950/40">
      <div className="mb-6">
        <p className="text-sm font-medium text-cyan-700">
          {isRegisterMode ? "Crie sua conta" : "Bem-vindo"}
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {isRegisterMode ? "Comece agora" : "Acesse sua conta"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {isRegisterMode
            ? "Informe seus dados para criar seu acesso."
            : "Entre para visualizar e gerenciar suas tarefas."}
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegisterMode && (
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Nome
            </label>

            <input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            E-mail
          </label>

          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Senha
          </label>

          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting
            ? "Processando..."
            : isRegisterMode
              ? "Criar conta"
              : "Entrar"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        {isRegisterMode ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
        <Link
          to={isRegisterMode ? "/login" : "/register"}
          onClick={clearError}
          className="font-semibold text-cyan-700 hover:text-cyan-800"
        >
          {isRegisterMode ? "Entrar" : "Criar cadastro"}
        </Link>
      </p>
    </div>
  );
}
