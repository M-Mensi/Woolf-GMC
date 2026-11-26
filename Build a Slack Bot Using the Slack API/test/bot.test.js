import test from "node:test";
import assert from "node:assert/strict";
import { registerSlackHandlers } from "../src/register-handlers.js";

function createRegisteredHandlers() {
  const handlers = { events: {}, messages: [], commands: {} };
  const app = {
    event: (name, handler) => { handlers.events[name] = handler; },
    message: (pattern, handler) => { handlers.messages.push({ pattern, handler }); },
    command: (name, handler) => { handlers.commands[name] = handler; }
  };
  registerSlackHandlers(app);
  return handlers;
}

test("message Events API handler logs a structured record and ignores bot and subtype events", async () => {
  const handlers = createRegisteredHandlers();
  const records = [];
  const logger = { info: (record) => records.push(JSON.parse(record)) };
  const message = {
    channel: "C123",
    user: "U456",
    text: "hello <@U789>",
    ts: "1710000000.000001"
  };

  await handlers.events.message({ event: message, logger });
  await handlers.events.message({ event: { ...message, bot_id: "B123" }, logger });
  await handlers.events.message({ event: { ...message, subtype: "message_changed" }, logger });

  assert.deepEqual(records, [{
    type: "slack_message",
    channel: "C123",
    user: "U456",
    text: "hello <@U789>",
    timestamp: "1710000000.000001"
  }]);
});

test("hello messages receive a threaded greeting while bot messages are ignored", async () => {
  const handlers = createRegisteredHandlers();
  const hello = handlers.messages[0];
  assert.equal(hello.pattern.test("hello team"), true);
  assert.equal(hello.pattern.test("goodbye"), false);

  const replies = [];
  await hello.handler({
    message: { user: "U456", ts: "1710000000.000001" },
    say: async (reply) => replies.push(reply)
  });
  await hello.handler({
    message: { user: "U456", bot_id: "B123", ts: "1710000000.000002" },
    say: async (reply) => replies.push(reply)
  });

  assert.deepEqual(replies, [{
    text: "Hello, <@U456>!",
    thread_ts: "1710000000.000001"
  }]);
});

test("/hello acknowledges the slash command and responds ephemerally", async () => {
  const handlers = createRegisteredHandlers();
  const calls = [];

  await handlers.commands["/hello"]({
    ack: async () => calls.push("ack"),
    command: { user_id: "U456" },
    respond: async (response) => calls.push(response)
  });

  assert.deepEqual(calls, [
    "ack",
    { response_type: "ephemeral", text: "Hello, <@U456>!" }
  ]);
});
