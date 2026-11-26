# Build a Slack Bot Using the Slack API

A small Node.js bot built with Slack Bolt. It listens for public-channel message events, writes ordinary user messages as structured JSON to stdout, replies in a thread when a message starts with `hello`, and implements the `/hello` slash command with an ephemeral response.

## Requirements

- Node.js 22.9 or later
- A Slack workspace where you can create and install apps
- A publicly reachable HTTPS URL when receiving real Slack events and slash commands

## Configure the Slack app

1. In the [Slack API dashboard](https://api.slack.com/apps), create an app for your workspace.
2. Under **OAuth & Permissions**, add the bot token scopes `channels:history`, `chat:write`, and `commands`, then install or reinstall the app. Copy its **Bot User OAuth Token** (`xoxb-...`).
3. Under **Event Subscriptions**, enable events and subscribe to the bot event `message.channels`.
4. Under **Slash Commands**, create `/hello`.
5. In both the Events API request URL and the `/hello` request URL, use `https://YOUR_PUBLIC_HOST/slack/events`. Slack Bolt verifies Slack signatures using the signing secret.
6. Invite the installed bot into the public channel you want it to listen to.

## Run locally

```powershell
npm ci
Copy-Item .env.example .env
```

Edit `.env` and replace the example values with the bot token and **Signing Secret** from **Basic Information** in the Slack API dashboard. Keep `.env` private; it is ignored by Git.

For a local test, expose port `3000` through a temporary HTTPS tunnel (for example, Cloudflare Tunnel or ngrok), then set both Slack request URLs to the tunnel URL plus `/slack/events`. Keep the tunnel running while testing.

```powershell
npm start
```

In the invited channel, send `hello` to get a threaded greeting, or run `/hello` for an ephemeral greeting. The message event listener logs JSON records to the server's standard output. Run `npm test` for handler tests and `npm run check` for syntax checks.

## Event and privacy notes

Slack Bolt handles request signing and acknowledgement. The bot logs the channel ID, user ID, message text, and Slack timestamp for ordinary user messages; it skips bot messages and message subtypes. Logs go to stdout only—this app does not write a local log file or database. Message text may contain personal or confidential information: use a restricted log destination, set an appropriate retention period, and obtain workspace approval before enabling content logging in a real workspace.

The `hello` listener is intentionally narrow to avoid replying to every channel post. Add only the event subscriptions and scopes the deployed bot needs.
