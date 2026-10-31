# Slack Bot

A simple Node.js Slack bot built with Slack Bolt. It listens for channel
messages using the Events API, logs received messages, and replies to the
`/hello` slash command.

## Set up Slack

Configure the Slack app with these bot token scopes:

- `chat:write`
- `channels:history`
- `commands`

Subscribe to the `message.channels` bot event. Enable Socket Mode and create an
app-level token with the `connections:write` scope. Install or reinstall the
app after changing scopes. Add `/hello` as a slash command in the app settings.

## Run locally

1. Install Node.js 18 or later.
2. From this folder, install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env` and add your newly rotated bot token and
   Socket Mode app token. Never commit `.env` or paste tokens into source code.
4. Start the bot:

   ```sh
   npm start
   ```

The bot logs regular channel messages to the terminal. Invite the app to a
channel for it to receive that channel's messages. Send `/hello` to receive a
reply.

## Token safety

If a token is exposed, revoke it in Slack, generate a replacement, and update
your local `.env` file. Do not reuse the exposed token.
