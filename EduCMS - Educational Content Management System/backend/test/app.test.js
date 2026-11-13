import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

process.env.DATABASE_URL ??= "postgres://postgres:postgres@localhost:5432/educms";
process.env.JWT_SECRET ??= "test-only-secret-that-is-long-enough-for-smoke";

test("API health, authentication guard, and registration validation", async (t) => {
  const { default: app } = await import("../src/app.js");
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const protectedResponse = await fetch(`${baseUrl}/api/courses`);
  assert.equal(protectedResponse.status, 401);

  const invalidRegistration = await fetch(`${baseUrl}/api/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "not-an-email", password: "short" }),
  });
  assert.equal(invalidRegistration.status, 400);
});
