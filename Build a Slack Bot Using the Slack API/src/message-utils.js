export function formatMessageLog(event) {
  if (
    !event ||
    typeof event !== "object" ||
    event.subtype ||
    event.bot_id ||
    typeof event.channel !== "string" ||
    typeof event.user !== "string"
  ) {
    return null;
  }

  return JSON.stringify({
    type: "slack_message",
    channel: event.channel,
    user: event.user,
    text: typeof event.text === "string" ? event.text : "",
    timestamp: typeof event.ts === "string" ? event.ts : null
  });
}

export function greetingForUser(userId) {
  return `Hello, <@${userId}>!`;
}
