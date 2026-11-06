const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
  awaitCall,
  chainedAsyncFunctions,
  iterateWithAsyncAwait,
} = require("../asyncTasks");

test("iterateWithAsyncAwait logs every value in order", async () => {
  const logged = [];
  const originalLog = console.log;
  console.log = (value) => logged.push(value);

  try {
    await iterateWithAsyncAwait(["one", "two", "three"]);
  } finally {
    console.log = originalLog;
  }

  assert.deepEqual(logged, ["one", "two", "three"]);
});

test("awaitCall awaits and logs API data", async () => {
  const logged = [];
  const originalLog = console.log;
  console.log = (value) => logged.push(value);
  const data = { answer: 42 };

  try {
    const result = await awaitCall(async () => data);
    assert.equal(result, data);
  } finally {
    console.log = originalLog;
  }

  assert.deepEqual(logged, [data]);
});

test("awaitCall handles API errors with a friendly message", async () => {
  const logged = [];
  const originalError = console.error;
  console.error = (message) => logged.push(message);

  try {
    await awaitCall(async () => {
      throw new Error("Request failed");
    });
  } finally {
    console.error = originalError;
  }

  assert.deepEqual(logged, ["Unable to fetch data. Please try again later."]);
});

test("chainedAsyncFunctions runs its three steps sequentially", async () => {
  const logged = [];
  const originalLog = console.log;
  console.log = (message) => logged.push(message);

  try {
    await chainedAsyncFunctions();
  } finally {
    console.log = originalLog;
  }

  assert.deepEqual(logged, [
    "First async function complete",
    "Second async function complete",
    "Third async function complete",
  ]);
});
