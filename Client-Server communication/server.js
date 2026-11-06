const http = require("node:http");

const todos = [];
let nextId = 1;
const MAX_BODY_SIZE = 1024 * 1024;

function sendJson(response, statusCode, data, headers = {}) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(data));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    const contentType = request.headers["content-type"] || "";
    if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
      reject(Object.assign(new Error("Content-Type must be application/json"), { statusCode: 415 }));
      request.resume();
      return;
    }

    let body = "";
    let bodySize = 0;
    let settled = false;
    request.on("data", (chunk) => {
      if (settled) return;
      bodySize += chunk.length;
      if (bodySize > MAX_BODY_SIZE) {
        settled = true;
        reject(Object.assign(new Error("Request body is too large"), { statusCode: 413 }));
        request.resume();
        return;
      }
      body += chunk;
    });
    request.on("end", () => {
      if (settled) return;
      try {
        settled = true;
        resolve(JSON.parse(body));
      } catch {
        settled = true;
        reject(Object.assign(new Error("Request body must be valid JSON"), { statusCode: 400 }));
      }
    });
    request.on("error", (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    });
  });
}

function validateTodoInput(data, { allowEmpty = false } = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Request body must be a JSON object";
  }

  const hasTitle = Object.hasOwn(data, "title");
  const hasCompleted = Object.hasOwn(data, "completed");
  if (!hasTitle && !hasCompleted && !allowEmpty) {
    return "Provide a title or completed status";
  }
  if (hasTitle && (typeof data.title !== "string" || data.title.trim() === "")) {
    return "Title must be a non-empty string";
  }
  if (hasCompleted && typeof data.completed !== "boolean") {
    return "Completed must be a boolean";
  }

  return null;
}

function createServer() {
  return http.createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    const collectionPath = url.pathname === "/api/todos";
    const itemMatch = url.pathname.match(/^\/api\/todos\/([^/]+)$/);

    if (!collectionPath && !itemMatch) {
      sendJson(response, 404, { error: "Route not found" });
      return;
    }

    if (collectionPath && request.method === "GET") {
      sendJson(response, 200, todos);
      return;
    }

    if (collectionPath && request.method === "POST") {
      try {
        const data = await readJsonBody(request);
        const validationError = validateTodoInput(data);
        if (validationError || !Object.hasOwn(data, "title")) {
          sendJson(response, 400, { error: validationError || "Title is required" });
          return;
        }

        const todo = {
          id: nextId++,
          title: data.title.trim(),
          completed: data.completed ?? false,
        };
        todos.push(todo);
        sendJson(response, 201, todo, { Location: `/api/todos/${todo.id}` });
      } catch (error) {
        sendJson(response, error.statusCode || 500, { error: error.message || "Internal server error" });
      }
      return;
    }

    if (itemMatch) {
      const id = Number(itemMatch[1]);
      const todo = todos.find((item) => item.id === id);
      if (!Number.isSafeInteger(id) || id < 1 || !todo) {
        sendJson(response, 404, { error: "Todo not found" });
        return;
      }

      if (request.method === "GET") {
        sendJson(response, 200, todo);
        return;
      }

      if (request.method === "PUT" || request.method === "PATCH") {
        try {
          const data = await readJsonBody(request);
          const validationError = validateTodoInput(data);
          if (validationError) {
            sendJson(response, 400, { error: validationError });
            return;
          }

          if (Object.hasOwn(data, "title")) todo.title = data.title.trim();
          if (Object.hasOwn(data, "completed")) todo.completed = data.completed;
          sendJson(response, 200, todo);
        } catch (error) {
          sendJson(response, error.statusCode || 500, { error: error.message || "Internal server error" });
        }
        return;
      }

      if (request.method === "DELETE") {
        todos.splice(todos.indexOf(todo), 1);
        response.writeHead(204);
        response.end();
        return;
      }
    }

    sendJson(response, 405, { error: "Method not allowed" }, {
      Allow: collectionPath ? "GET, POST" : "GET, PUT, PATCH, DELETE",
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => {
    console.log(`To-do API listening on http://localhost:${port}`);
  });
}

module.exports = { createServer };
