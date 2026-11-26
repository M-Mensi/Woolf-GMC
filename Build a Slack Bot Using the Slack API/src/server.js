import { App, LogLevel } from "@slack/bolt";
import { registerSlackHandlers } from "./register-handlers.js";

const requiredVariables = ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"];
const missingVariables = requiredVariables.filter((name) => !process.env[name]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
}

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  deferInitialization: true,
  logLevel: LogLevel.INFO
});

registerSlackHandlers(app);

try {
  await app.init();
  await app.start(port);
  app.logger.info(`Slack bot listening on port ${port}.`);
} catch (error) {
  app.logger.error("Failed to start the Slack bot.", error);
  process.exitCode = 1;
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    try {
      await app.stop();
    } catch (error) {
      app.logger.error(`Failed to stop cleanly after ${signal}.`, error);
      process.exitCode = 1;
    }
  });
}
