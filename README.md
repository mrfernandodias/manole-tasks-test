# Teste Técnico - Editora Manole

Este projeto foi desenvolvido para o teste técnico da Editora Manole.

A ideia é entregar uma aplicação simples de gerenciamento de tarefas, com backend, frontend, persistência em banco de dados e a parte de lógica/fundamentos solicitada no teste.

Minha prioridade nesta implementação foi manter o projeto claro, funcional e fácil de rodar. Evitei adicionar camadas ou recursos que não fossem necessários para o escopo do teste.

## Stack utilizada

- Backend: Node.js + Express
- Banco de dados: SQLite
- Frontend: React + Vite + Tailwind CSS
- Testes: Node Test Runner

---

## Parte 1 - Lógica e Fundamentos

### 1. Lógica

A função de lógica está implementada em:

```text
backend/src/utils/analyzeNumbers.js
```

Ela recebe uma lista de valores, considera apenas números inteiros válidos e retorna:

- a soma dos números pares;
- a média dos números ímpares;
- ignorando valores inválidos como `null`, `undefined`, strings, objetos e arrays.

Quando não há números ímpares válidos, a média retorna `0`.

Exemplo de entrada:

```js
[1, 2, 3, 4, 5, "a", null];
```

Saída esperada:

```json
{
  "somaPares": 6,
  "mediaImpares": 3
}
```

Também foi criado um teste automatizado para validar a função:

```text
backend/tests/analyzeNumbers.test.js
```

Para executar os testes:

```bash
cd backend
npm test
```

---

### 2. Conceitos

#### Diferença entre REST e GraphQL

REST organiza a API em recursos e endpoints. Por exemplo, para tarefas, faz sentido ter rotas como `GET /tasks`, `POST /tasks` e `PUT /tasks/:id`.

GraphQL segue outra ideia: em vez de vários endpoints, normalmente existe uma rota principal onde o cliente descreve exatamente quais dados quer receber.

Na prática, eu usaria REST neste teste porque o escopo é simples, os recursos são bem definidos e o CRUD de tarefas fica fácil de entender. GraphQL faria mais sentido se a aplicação tivesse telas muito diferentes consumindo combinações variadas de dados.

#### O que é transação em banco de dados

Uma transação é uma forma de garantir que um conjunto de operações aconteça por completo ou não aconteça.

Um exemplo simples é uma transferência de valores: não dá para debitar de uma conta e falhar antes de creditar na outra. Nesse caso, o banco precisa confirmar tudo junto ou desfazer tudo.

Em sistemas de gestão, transações são importantes quando uma ação altera mais de uma tabela ou quando a consistência dos dados é crítica.

#### Diferença entre autenticação e autorização

Autenticação responde à pergunta: **quem é o usuário?**

Exemplo: login com e-mail e senha.

Autorização responde à pergunta: **o que esse usuário pode fazer?**

Exemplo: um usuário autenticado pode listar tarefas, mas talvez não possa excluir registros ou acessar áreas administrativas.

Ou seja: primeiro o sistema identifica o usuário; depois verifica suas permissões.

#### Quando usar cache e quando evitar

Cache é útil quando um dado é lido muitas vezes e muda pouco. Ele ajuda a reduzir consultas repetidas e melhorar o tempo de resposta.

Eu usaria cache, por exemplo, em listas públicas, configurações pouco alteradas ou respostas de APIs externas.

Eu evitaria cache quando o dado muda com frequência ou quando mostrar uma informação desatualizada pode causar problema. Alguns exemplos são saldo financeiro, estoque em tempo real, permissões recém-alteradas ou qualquer informação sensível que precise refletir o estado atual.
