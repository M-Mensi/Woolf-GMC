# In-memory To-do API

A REST API built with Node.js core modules. Tasks are stored in memory and reset when the server restarts.

## Run

```sh
npm start
```

The server listens on port `3000` by default. Set `PORT` to use another port.

## Routes

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/todos` | List all tasks |
| `GET` | `/api/todos/:id` | Get a task |
| `POST` | `/api/todos` | Create a task with a required `title` and optional boolean `completed` |
| `PUT` / `PATCH` | `/api/todos/:id` | Update a task's `title` and/or `completed` |
| `DELETE` | `/api/todos/:id` | Delete a task |

Send JSON with `Content-Type: application/json`. New tasks default to `completed: false`.

Run the tests with `npm test`.
