# Teste Técnico - Editora Manole

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](#)
[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/mrfernandodias/manole-tasks-test?utm_source=oss&utm_medium=github&utm_campaign=mrfernandodias%2Fmanole-tasks-test&labelColor=171717&color=FF570A&label=CodeRabbit+Reviews)](https://coderabbit.ai)

Este projeto foi desenvolvido para o teste técnico da Editora Manole.

A proposta era criar uma aplicação de gerenciamento de tarefas com backend, frontend, banco de dados e uma parte de lógica/fundamentos. Além dos requisitos obrigatórios, implementei alguns diferenciais para deixar a entrega mais completa, mas tentando manter o projeto simples de entender e fácil de rodar.

Minha prioridade foi construir algo funcional, organizado e com decisões técnicas defensáveis, sem transformar o teste em uma arquitetura maior do que precisava ser.

---

## Deploy

Frontend:

```text
https://manole-tasks-frontend.vercel.app
```

Backend:

```text
https://manole-tasks-api.onrender.com
```

Health check da API:

```text
https://manole-tasks-api.onrender.com/health
```

O frontend foi publicado na Vercel e o backend na Render. Para o ambiente remoto, o backend usa cookies com `COOKIE_SECURE=true` e `COOKIE_SAME_SITE=none`, já que frontend e API estão em domínios diferentes.

---

## Stack utilizada

### Backend

- Node.js
- Express
- SQLite
- better-sqlite3
- JWT
- bcrypt
- cookie-parser
- Node Test Runner

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- lucide-react

### Extras

- Docker / Docker Compose
- Postman Collection
- Seed para dados de demonstração
- CodeRabbit para apoio em revisão de Pull Requests

---

## O que foi implementado

### Lógica e fundamentos

- Função para analisar uma lista de valores.
- Soma dos números pares.
- Média dos números ímpares.
- Valores inválidos são ignorados.
- Testes automatizados para a função.

### Backend

- API REST com Express.
- CRUD completo de tarefas.
- Persistência em SQLite.
- Validação de dados.
- Status HTTP adequados.
- Paginação.
- Filtro por status.
- Busca por título ou descrição.
- Autenticação com JWT.
- Refresh token em cookie HttpOnly.
- Rotação de refresh token.
- Logout com revogação do refresh token.
- Isolamento das tarefas por usuário autenticado.
- Testes automatizados da API.
- Seed com usuário e tarefas de demonstração.

### Frontend

- Interface em React com TypeScript.
- Tela de login e cadastro.
- Rotas protegidas.
- Listagem de tarefas.
- Criação de tarefas.
- Alteração de status.
- Exclusão com modal de confirmação.
- Filtro por status.
- Busca por título ou descrição.
- Paginação.
- Loading, tratamento de erro e toast de feedback.
- Layout responsivo básico.
- Separação em componentes, services e types.

### Extras incluídos

- Docker Compose para subir backend e frontend.
- Deploy do frontend na Vercel.
- Deploy do backend na Render.
- Collection do Postman para testar a API.
- Environment local do Postman.
- Seed para facilitar os testes manuais.
- CodeRabbit configurado para apoio na revisão de Pull Requests.

---

## Estrutura do projeto

```text
manole-tasks-test/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── tests/
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── features/
│       ├── routes/
│       ├── services/
│       └── types/
├── docs/
│   └── postman/
├── docker-compose.yml
└── README.md
```

---

## Como rodar com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

A aplicação ficará disponível em:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3333
```

Para parar os containers:

```bash
docker compose down
```

Para rodar os testes do backend pelo Docker:

```bash
docker compose run --rm backend npm test
```

Para executar o seed pelo Docker:

```bash
docker compose run --rm backend npm run seed
```

---

## Como rodar localmente

### Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Exemplo de `.env` para ambiente local:

```env
PORT=3333
DATABASE_PATH=data/tasks.db
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=change-this-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

Para gerar um valor mais seguro para `JWT_SECRET`, existe o comando:

```bash
npm run generate:secret
```

Ele gera uma string aleatória que pode ser usada no `.env`:

```env
JWT_SECRET=valor-gerado-pelo-comando
```

Para rodar localmente, mantenha:

```env
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

Em produção, usando HTTPS e frontend/backend em domínios diferentes, use:

```env
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

Inicie o backend:

```bash
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3333
```

---

### Frontend

Em outro terminal, entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```bash
cp .env.example .env
```

Exemplo:

```env
VITE_API_URL=http://localhost:3333
```

Inicie o frontend:

```bash
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

---

## Variáveis de ambiente em produção

### Render - backend

```env
DATABASE_PATH=data/tasks.db
CORS_ORIGIN=https://manole-tasks-frontend.vercel.app
JWT_SECRET=valor-gerado-com-npm-run-generate-secret
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

### Vercel - frontend

```env
VITE_API_URL=https://manole-tasks-api.onrender.com
```

---

## Usuário demo e seed

Para facilitar os testes, existe um seed que cria um usuário demo e algumas tarefas com status variados.

Dentro da pasta `backend`:

```bash
npm run seed
```

Acesso demo:

```text
E-mail: demo@manole.com
Senha: 123456
```

Esse seed ajuda a testar rapidamente:

- listagem;
- paginação;
- filtro por status;
- busca;
- alteração de status;
- exclusão.

---

## Testes automatizados

Os testes do backend usam o Node Test Runner.

Dentro da pasta `backend`:

```bash
npm test
```

Foram incluídos testes para:

- função de lógica da Parte 1;
- autenticação obrigatória nas rotas de tarefas;
- criação de tarefa;
- listagem de tarefas;
- validações básicas;
- busca por título e descrição;
- combinação de busca com filtro de status.

---

## Collection do Postman

A collection do Postman está em:

```text
docs/postman/manole-tasks-api.postman_collection.json
```

O environment local está em:

```text
docs/postman/manole-tasks-local.postman_environment.json
```

Para usar:

1. Importe a collection no Postman.
2. Importe o environment.
3. Selecione o environment `Manole Tasks - Local`.
4. Rode `Auth > Login` ou `Auth > Register`.
5. O `accessToken` será salvo automaticamente.
6. Ao criar uma tarefa, o `taskId` também será salvo para testar consulta, atualização e exclusão.

A documentação da API ficou coberta pelo próprio README e pela collection do Postman. A collection também facilita a validação manual dos fluxos principais sem precisar montar as requisições do zero.

---

## Rotas principais da API

### Health Check

```http
GET /health
```

### Auth

```http
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/refresh
POST /auth/logout
```

### Tasks

```http
POST /tasks
GET /tasks
GET /tasks/:id
PUT /tasks/:id
DELETE /tasks/:id
```

O endpoint `GET /tasks` aceita parâmetros opcionais:

```http
GET /tasks?page=1&limit=10
GET /tasks?status=pendente
GET /tasks?search=docker
GET /tasks?status=pendente&search=teste&page=1&limit=5
```

Status aceitos:

```text
pendente
em andamento
concluída
```

---

## Parte 1 - Lógica e Fundamentos

### Lógica

A função está em:

```text
backend/src/utils/analyzeNumbers.js
```

Ela recebe uma lista de valores, considera apenas números inteiros válidos e retorna:

- a soma dos números pares;
- a média dos números ímpares;
- ignorando valores inválidos como `null`, `undefined`, strings, objetos e arrays.

Quando não há números ímpares válidos, a média retorna `0`.

Exemplo:

```js
[1, 2, 3, 4, 5, "a", null];
```

Saída:

```json
{
  "somaPares": 6,
  "mediaImpares": 3
}
```

Teste relacionado:

```text
backend/tests/analyzeNumbers.test.js
```

---

## Respostas conceituais

### Diferença entre REST e GraphQL

REST organiza a API em recursos e endpoints. Por exemplo, para tarefas, faz sentido ter rotas como `GET /tasks`, `POST /tasks` e `PUT /tasks/:id`.

GraphQL segue outra abordagem: normalmente existe uma rota principal onde o cliente informa exatamente quais dados quer receber.

Neste projeto, REST faz mais sentido porque o escopo é simples, os recursos são claros e o CRUD de tarefas fica direto de entender. GraphQL faria mais sentido em uma aplicação com muitas telas consumindo combinações diferentes de dados.

### O que é transação em banco de dados

Uma transação garante que um conjunto de operações seja concluído por completo ou desfeito por completo.

Um exemplo clássico é uma transferência de valores: não dá para debitar de uma conta e falhar antes de creditar na outra. O banco precisa confirmar tudo junto ou desfazer tudo.

Em sistemas de gestão, transações são importantes quando uma ação altera mais de uma tabela ou quando a consistência dos dados é crítica.

### Diferença entre autenticação e autorização

Autenticação responde: **quem é o usuário?**

Exemplo: login com e-mail e senha.

Autorização responde: **o que esse usuário pode fazer?**

Exemplo: um usuário autenticado pode acessar suas próprias tarefas, mas talvez não possa acessar áreas administrativas.

Ou seja: primeiro o sistema identifica o usuário; depois verifica suas permissões.

### Quando usar cache e quando evitar

Cache é útil quando um dado é lido muitas vezes e muda pouco. Ele ajuda a reduzir consultas repetidas e melhorar o tempo de resposta.

Eu usaria cache em listas públicas, configurações pouco alteradas ou respostas de APIs externas.

Eu evitaria cache quando o dado muda com frequência ou quando uma informação desatualizada pode causar problema. Exemplos: saldo financeiro, estoque em tempo real, permissões recém-alteradas ou informações sensíveis.

---

## Decisões técnicas

### Express

Escolhi Express porque o escopo do teste era direto e uma API REST simples atendia bem. Um framework mais robusto também funcionaria, mas poderia adicionar complexidade sem necessidade.

### SQLite

Usei SQLite pela praticidade. Ele permite rodar o projeto sem instalar um serviço externo de banco de dados. Para uma aplicação real em produção, eu avaliaria PostgreSQL.

### Autenticação

Implementei access token JWT e refresh token em cookie HttpOnly.

O access token é usado pelo frontend no header `Authorization`. O refresh token fica protegido em cookie HttpOnly e é usado para renovar a sessão.

Também implementei rotação de refresh token. A cada renovação, o token anterior é revogado e um novo é emitido.

### Isolamento por usuário

As tarefas são sempre associadas ao usuário autenticado. Assim, um usuário não consegue listar, alterar ou excluir tarefas de outro usuário.

### Frontend

No frontend, separei chamadas HTTP em services, tipos em arquivos próprios e a tela de tarefas em componentes menores. A ideia foi manter o código fácil de acompanhar, sem criar abstrações demais.

### Docker

Adicionei Docker Compose para facilitar a execução local do projeto, principalmente para quem quiser avaliar sem configurar cada parte manualmente.

### Deploy

O frontend foi publicado na Vercel e o backend na Render. Como são domínios diferentes, o backend foi configurado para usar cookie `Secure` e `SameSite=None` no ambiente remoto.

---

## Pontos fortes

- Projeto simples de rodar.
- API REST organizada.
- CRUD completo.
- Validações no backend.
- Persistência em banco.
- Autenticação JWT com refresh token.
- Rotação de refresh token.
- Tarefas isoladas por usuário.
- Frontend com TypeScript.
- Interface responsiva e amigável.
- Loading, erro e feedback visual.
- Testes automatizados.
- Docker Compose.
- Seed para dados de demonstração.
- Collection do Postman.
- Deploy simples com Vercel e Render.
- CodeRabbit configurado para apoio em revisão de Pull Requests.

---

## Limitações e melhorias futuras

Alguns pontos ficaram fora do escopo para manter o projeto objetivo:

- Não implementei controle avançado de permissões.
- Não implementei edição completa da tarefa no frontend, apenas alteração de status.
- Não implementei blacklist de access token. No logout, o refresh token é revogado, mas um access token já emitido continua válido até expirar.
- Não implementei recuperação de senha.
- Não implementei testes automatizados no frontend.
- A busca usa `LIKE`, suficiente para este escopo. Em uma base maior, eu avaliaria uma estratégia mais robusta.
- No deploy da Render, o projeto ainda usa SQLite por simplicidade. Para um ambiente real, eu migraria para PostgreSQL ou usaria um banco gerenciado.

Se tivesse mais tempo, eu priorizaria:

1. testes de frontend;
2. edição completa de tarefas;
3. especificação OpenAPI/Swagger;
4. renovação automática do access token durante chamadas autenticadas;
5. migração para PostgreSQL em um cenário mais próximo de produção.

---

## Comandos úteis

### Backend

```bash
cd backend
npm run dev
npm test
npm run seed
npm run generate:secret
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
```

### Docker

```bash
docker compose up --build
docker compose down
docker compose run --rm backend npm test
docker compose run --rm backend npm run seed
```

---

## Observação final

Como era um teste técnico com escopo bem definido, preferi uma solução objetiva, mas com alguns cuidados extras em pontos que considero importantes: autenticação, validação, isolamento por usuário, testes, Docker, deploy e uma interface simples de usar.

A aplicação não tenta ser maior do que precisa ser, mas entrega o fluxo principal completo e deixa espaço claro para evolução.
