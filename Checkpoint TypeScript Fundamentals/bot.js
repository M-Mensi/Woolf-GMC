require("dotenv").config();

const { App } = require("@slack/bolt");

const { SLACK_BOT_TOKEN, SLACK_APP_TOKEN } = process.env;

if (!SLACK_BOT_TOKEN || !SLACK_APP_TOKEN) {
  throw new Error(
    "Missing Slack credentials. Set SLACK_BOT_TOKEN and SLACK_APP_TOKEN in .env."
  );
}

// Socket Mode lets the bot receive Slack events locally without a public URL.
const app = new App({
  token: SLACK_BOT_TOKEN,
  appToken: SLACK_APP_TOKEN,
  socketMode: true,
});

// Handle the /hello slash command and send a reply in the originating channel.
app.command("/hello", async ({ ack, say }) => {
  await ack();
  await say("Hello! :wave:");
});

// Log regular channel messages received through the Events API.
app.event("message", async ({ event }) => {
  console.log(
    `[message] channel=${event.channel} user=${event.user ?? "unknown"} subtype=${event.subtype ?? "standard"} text=${event.text ?? ""}`
  );
});

// Start the bot and report startup errors rather than silently swallowing them.
async function startBot() {
  await app.start();
  console.log("Slack bot is running with Socket Mode.");
}

startBot().catch((error) => {
  console.error("Could not start the Slack bot.", error);
  process.exitCode = 1;
});
