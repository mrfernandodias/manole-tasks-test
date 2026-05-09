import db from "./db.js";
import { createTask } from "../models/task.model.js";
import { createUser, findUserByEmail } from "../models/user.model.js";
import { hashPassword } from "../utils/password.js";

const demoUser = {
  name: "Usuário Demo",
  email: "demo@manole.com",
  password: "123456",
};

const demoTasks = [
  {
    title: "Revisar requisitos do teste técnico",
    description:
      "Conferir se backend, frontend e README cobrem o escopo pedido.",
    status: "pendente",
  },
  {
    title: "Validar autenticação JWT",
    description: "Testar login, refresh token, logout e rotas protegidas.",
    status: "em andamento",
  },
  {
    title: "Testar criação de tarefas",
    description: "Criar tarefas com título, descrição e status inicial.",
    status: "concluída",
  },
  {
    title: "Conferir paginação",
    description:
      "Garantir que a API e o frontend navegam corretamente entre páginas.",
    status: "pendente",
  },
  {
    title: "Revisar filtro por status",
    description: "Validar filtros de pendente, em andamento e concluída.",
    status: "em andamento",
  },
  {
    title: "Testar exclusão de tarefa",
    description: "Confirmar modal de exclusão e atualização da lista.",
    status: "pendente",
  },
  {
    title: "Executar testes automatizados",
    description: "Rodar npm test no backend antes da entrega.",
    status: "concluída",
  },
  {
    title: "Validar Docker Compose",
    description: "Subir frontend e backend com docker compose up --build.",
    status: "concluída",
  },
  {
    title: "Revisar responsividade",
    description: "Testar telas principais em largura mobile e desktop.",
    status: "pendente",
  },
  {
    title: "Atualizar documentação",
    description: "Descrever decisões técnicas, limitações e melhorias futuras.",
    status: "em andamento",
  },
  {
    title: "Preparar entrega no GitHub",
    description: "Conferir commits, README e instruções finais.",
    status: "pendente",
  },
  {
    title: "Revisar collection do Postman",
    description: "Organizar requisições para facilitar testes manuais da API.",
    status: "pendente",
  },
];

async function seed() {
  let user = findUserByEmail(demoUser.email);

  if (!user) {
    const passwordHash = await hashPassword(demoUser.password);

    user = createUser(demoUser.name, demoUser.email, passwordHash);
    console.log(`Usuário demo criado: ${demoUser.email}`);
  } else {
    console.log(`Usuário demo já existe: ${demoUser.email}`);
  }

  db.prepare("DELETE FROM tasks WHERE user_id = ?").run(user.id);

  for (const task of demoTasks) {
    createTask({
      userId: user.id,
      title: task.title,
      description: task.description,
      status: task.status,
    });
  }

  console.log(`${demoTasks.length} tarefas demo criadas.`);
  console.log("");
  console.log("Acesso demo:");
  console.log(`E-mail: ${demoUser.email}`);
  console.log(`Senha: ${demoUser.password}`);
}

seed().catch((error) => {
  console.error("Erro ao executar seed:", error);
  process.exit(1);
});
