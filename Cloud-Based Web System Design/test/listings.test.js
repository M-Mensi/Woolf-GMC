import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet, onRequestPost } from "../functions/api/listings.js";
import { onRequestPost as onClaim } from "../functions/api/listings/[id]/claim.js";

function createDatabase({ changes = 1 } = {}) {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      const call = { sql, values: [] };
      calls.push(call);
      return {
        bind(...values) {
          call.values = values;
          return {
            all: async () => ({ results: [] }),
            first: async () => ({ id: "listing-1", portions_remaining: 2, status: "available" }),
            run: async () => ({ meta: { changes } }),
          };
        },
      };
    },
    async batch(statements) {
      return [{ meta: { changes } }, { meta: { changes: changes ? 1 : 0 } }];
    },
  };
}

function request(path, { method = "GET", headers = {}, body } = {}) {
  return new Request(`https://shareplate.example${path}`, {
    method,
    headers: body === undefined ? headers : { "content-type": "application/json", ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

test("listing feed returns the database results and rejects invalid categories", async () => {
  const DB = createDatabase();
  const response = await onRequestGet({ request: request("/api/listings?category=produce"), env: { DB } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { listings: [] });
  assert.match(DB.calls[0].sql, /category = \?/);

  const invalid = await onRequestGet({ request: request("/api/listings?category=invalid"), env: { DB } });
  assert.equal(invalid.status, 400);
});

test("publishing requires the configured coordinator key", async () => {
  const DB = createDatabase();
  const body = { title: "Vegetable boxes", category: "produce", portions: 8, neighborhood: "North Market", pickup_at: "2027-01-15T17:30:00Z" };
  const denied = await onRequestPost({ request: request("/api/listings", { method: "POST", body }), env: { DB, ADMIN_KEY: "secret" } });
  assert.equal(denied.status, 401);
  assert.equal(DB.calls.length, 0);

  const accepted = await onRequestPost({
    request: request("/api/listings", { method: "POST", headers: { "x-admin-key": "secret" }, body }),
    env: { DB, ADMIN_KEY: "secret" },
  });
  assert.equal(accepted.status, 201);
  assert.equal(DB.calls[0].values[3], 8);
});

test("publishing rejects invalid portions and missing coordinator configuration", async () => {
  const DB = createDatabase();
  const body = { title: "Veg", category: "produce", portions: 0, neighborhood: "North", pickup_at: "2027-01-15T17:30:00Z" };
  const invalid = await onRequestPost({
    request: request("/api/listings", { method: "POST", headers: { "x-admin-key": "secret" }, body }),
    env: { DB, ADMIN_KEY: "secret" },
  });
  assert.equal(invalid.status, 400);
  assert.match((await invalid.json()).error, /Portions/);

  const unconfigured = await onRequestPost({ request: request("/api/listings", { method: "POST", body }), env: { DB } });
  assert.equal(unconfigured.status, 503);
});

test("claim validates portion counts and reports a stale or insufficient offer", async () => {
  const DB = createDatabase({ changes: 0 });
  const invalid = await onClaim({
    request: request("/api/listings/listing-1/claim", { method: "POST", body: { portions: 0 } }),
    env: { DB },
    params: { id: "listing-1" },
  });
  assert.equal(invalid.status, 400);

  const unavailable = await onClaim({
    request: request("/api/listings/listing-1/claim", { method: "POST", body: { portions: 2 } }),
    env: { DB },
    params: { id: "listing-1" },
  });
  assert.equal(unavailable.status, 409);
  assert.equal(DB.calls.length, 2);
});
