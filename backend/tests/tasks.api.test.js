import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import fs from "node:fs";
import path from "node:path";

const testDatabasePath = path.resolve("data/tasks-test.db");

let server;
let baseUrl;
let accessToken;

async function request(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);

  return {
    status: response.status,
    body,
    headers: response.headers,
  };
}

async function registerUser() {
  const response = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: "Fernando Dias",
      email: "fernando.api.test@example.com",
      password: "123456",
    }),
  });

  assert.equal(response.status, 201);
  assert.ok(response.body.accessToken);

  accessToken = response.body.accessToken;
}

async function createTaskForTest(task) {
  const response = await request("/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(task),
  });

  assert.equal(response.status, 201);

  return response.body.data;
}

describe("Tasks API", () => {
  before(async () => {
    process.env.DATABASE_PATH = testDatabasePath;
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "15m";
    process.env.REFRESH_TOKEN_EXPIRES_DAYS = "7";
    process.env.CORS_ORIGIN = "http://localhost:5173";

    fs.mkdirSync(path.dirname(testDatabasePath), { recursive: true });

    if (fs.existsSync(testDatabasePath)) {
      fs.unlinkSync(testDatabasePath);
    }

    const { default: app } = await import("../src/app.js");

    server = app.listen(0);
    const address = server.address();

    baseUrl = `http://localhost:${address.port}`;

    await registerUser();
  });

  after(() => {
    server.close();

    if (fs.existsSync(testDatabasePath)) {
      fs.unlinkSync(testDatabasePath);
    }
  });

  test("should reject task listing without authorization token", async () => {
    const response = await request("/tasks");

    assert.equal(response.status, 401);
    assert.equal(response.body.error, "Authorization token is required");
  });

  test("should create a task for the authenticated user", async () => {
    const response = await request("/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: "Write API tests",
        description: "Cover the main task endpoints",
        status: "pendente",
      }),
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.message, "Task created successfully");
    assert.equal(response.body.data.title, "Write API tests");
    assert.equal(
      response.body.data.description,
      "Cover the main task endpoints",
    );
    assert.equal(response.body.data.status, "pendente");
    assert.ok(response.body.data.id);
    assert.ok(response.body.data.created_at);
  });

  test("should list tasks for the authenticated user", async () => {
    const response = await request("/tasks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body.data));
    assert.equal(response.body.data.length, 1);
    assert.equal(response.body.meta.page, 1);
    assert.equal(response.body.meta.limit, 10);
    assert.equal(response.body.meta.total, 1);
  });

  test("should reject task creation without title", async () => {
    const response = await request("/tasks", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        description: "Task without title",
        status: "pendente",
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "Title is required");
  });

  test("should reject invalid task ID", async () => {
    const response = await request("/tasks/abc", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.error, "Invalid task ID");
  });

  test("should search tasks by title", async () => {
    await createTaskForTest({
      title: "Review Docker setup",
      description: "Validate containers before delivery",
      status: "pendente",
    });

    await createTaskForTest({
      title: "Write README",
      description: "Document how to run the project",
      status: "em andamento",
    });

    const response = await request("/tasks?search=Docker", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.status, 200);
    assert.ok(response.body.data.length >= 1);

    const titles = response.body.data.map((task) => task.title);

    assert.ok(titles.includes("Review Docker setup"));
  });

  test("should search tasks by description", async () => {
    await createTaskForTest({
      title: "Prepare final review",
      description: "Check frontend responsiveness",
      status: "pendente",
    });

    const response = await request("/tasks?search=responsiveness", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    assert.equal(response.status, 200);
    assert.ok(response.body.data.length >= 1);

    const descriptions = response.body.data.map((task) => task.description);

    assert.ok(descriptions.includes("Check frontend responsiveness"));
  });

  test("should combine status filter and search", async () => {
    await createTaskForTest({
      title: "Search filter pending task",
      description: "This task should be returned",
      status: "pendente",
    });

    await createTaskForTest({
      title: "Search filter completed task",
      description: "This task should not be returned for pending filter",
      status: "concluída",
    });

    const response = await request(
      "/tasks?status=pendente&search=Search%20filter",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    assert.equal(response.status, 200);
    assert.ok(response.body.data.length >= 1);

    const statuses = response.body.data.map((task) => task.status);

    assert.ok(statuses.every((status) => status === "pendente"));
  });
});
