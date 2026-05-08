import { CheckCircle2, ClipboardList, LockKeyhole, Sparkles } from "lucide-react";

import { AuthForm } from "../components/AuthForm";

type AuthPageProps = {
  mode: "login" | "register";
};

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12 lg:flex-row lg:gap-16">
        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Teste Técnico - Editora Manole
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Gerencie tarefas com uma experiência simples, rápida e segura.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            Aplicação desenvolvida com API própria, autenticação JWT, refresh
            token, persistência em banco e uma interface moderna para controle
            de tarefas.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <ClipboardList className="mb-3 h-6 w-6 text-cyan-300" />
              <p className="text-sm font-medium">CRUD completo</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <LockKeyhole className="mb-3 h-6 w-6 text-cyan-300" />
              <p className="text-sm font-medium">Autenticação segura</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <CheckCircle2 className="mb-3 h-6 w-6 text-cyan-300" />
              <p className="text-sm font-medium">Status controlado</p>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full max-w-md lg:mt-0">
          <AuthForm mode={mode} />
        </div>
      </section>
    </main>
  );
}
