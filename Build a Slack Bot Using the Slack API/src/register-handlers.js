import { formatMessageLog, greetingForUser } from "./message-utils.js";

export function registerSlackHandlers(app) {
  app.event("message", async ({ event, logger }) => {
    const record = formatMessageLog(event);
    if (record) logger.info(record);
  });

  app.message(/^\s*hello\b/i, async ({ message, say }) => {
    if (!message.user || message.bot_id || message.subtype) return;

    await say({
      text: greetingForUser(message.user),
      thread_ts: message.ts
    });
  });

  app.command("/hello", async ({ ack, command, respond }) => {
    await ack();
    await respond({
      response_type: "ephemeral",
      text: greetingForUser(command.user_id)
    });
  });
}
