# EduCMS — Educational Content Management System

A full-stack starting point for managing educational courses and their lessons. The React admin panel talks to an Express API backed by PostgreSQL.

## Features

- Register and sign in with a hashed password and JWT session.
- View dashboard totals and manage courses (create, edit, publish/archive, delete).
- Add, edit, reorder, and remove lessons within each course.
- Responsive interface for desktop and mobile.
- PostgreSQL schema, migration command, request validation, rate limiting, and security headers.

## Requirements

- Node.js 20 or newer
- PostgreSQL 14 or newer

## Run locally

From this directory:

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a unique, long `JWT_SECRET`.
2. Create the database named `educms` (or update `DATABASE_URL`).
3. Install dependencies with `npm install`.
4. Create/update the database tables with `npm run migrate`.
5. Start the API and frontend with `npm run dev`.
6. Open [http://localhost:5173](http://localhost:5173) and create an account.

The API listens on port `4000` by default. The Vite development server proxies `/api` requests to it. In production, build the frontend with `npm run build` and run the backend with `npm start`; deploy the generated `frontend/dist` assets using your chosen static host.

## API

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/dashboard`
- `GET|POST /api/courses`, `GET|PATCH|DELETE /api/courses/:id`
- `POST /api/courses/:id/lessons`, `PATCH|DELETE /api/lessons/:id`
- `GET /api/health`

All course and lesson routes require a bearer token. A user can only access courses they created. Configure `CLIENT_ORIGIN` to the frontend origin in production. Course status is currently an authoring label; learner enrollment and public course delivery are not included.

## Heroku deployment notes

Create a Heroku app and PostgreSQL add-on, set `JWT_SECRET` and `NODE_ENV=production`, then run `npm run migrate` as a one-off dyno before starting the web process. Use a Heroku Node.js build that installs the root workspaces and builds the frontend. The backend uses Heroku's `DATABASE_URL` and enables PostgreSQL SSL in production.

This project intentionally keeps uploads, external search, Redis, WebSockets, and analytics integrations out of the initial implementation; those require service credentials and product-specific requirements.
