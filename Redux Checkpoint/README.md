# Redux To-Do Application

A simple task list that uses Redux Toolkit and React-Redux to manage global
state. Each task contains an `id`, a `description`, and an `isDone` status.

## Run locally

From this folder, install dependencies and start the development server:

```sh
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). Run the tests with
`npm test -- --watchAll=false`, or create a production build with `npm run build`.

## Features

- Add tasks after entering a non-empty description.
- Edit task descriptions without changing task ID or done status.
- Mark tasks done or not done with the checkbox.
- Filter the task list to show all, done, or not-done tasks.

Task state lives in the Redux store and resets when the page is refreshed.
