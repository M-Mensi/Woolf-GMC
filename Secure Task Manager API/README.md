# Secure Task Manager API

A basic Express and MongoDB REST API. It supports email/password accounts, Google OAuth, JWT authentication in an HTTP-only cookie, and private task routes.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGODB_URI`, `JWT_SECRET`, and `SESSION_SECRET`. Use different random secrets with at least 32 characters.
3. Optionally add Google OAuth client credentials and a callback URL. Register that same callback URL in your Google OAuth client.
4. Install the dependencies listed in `package.json`, then run `npm start`.

The app listens on port 3000 by default. In production, serve it over HTTPS so the JWT cookie is marked secure.

## Routes

- `POST /auth/signup` with `{ "email": "you@example.com", "password": "at-least-8-characters" }`
- `POST /auth/login` with `{ "email": "you@example.com", "password": "your-password" }`
- `POST /auth/logout`
- `GET /auth/google` and `GET /auth/google/callback` when Google OAuth is configured
- `POST /tasks` with `{ "title": "A task", "description": "Optional details" }`
- `GET /tasks`
- `DELETE /tasks/:id`

Signup and login set an HTTP-only `token` cookie. Send that cookie with task requests. Task ownership is always taken from the authenticated user, not the request body.

The OAuth state session uses Express's default in-memory session store for this small checkpoint. Replace it with a persistent session store before running multiple production instances.
