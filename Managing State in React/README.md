# Managing State in React: To-Do List

A small React task manager demonstrating component-based state, validated forms,
task completion, filtering, and persistence with browser `localStorage`.

## Run locally

1. Install Node.js (and npm).
2. From this folder, install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm start
   ```

   The app opens at [http://localhost:3000](http://localhost:3000).

Run the test suite with `npm test -- --watchAll=false`, or create a production
build with `npm run build`.

## Using the app

- Both a task name and description are required. Whitespace-only values are
  rejected.
- Click a task's name or description, or use its **Edit** button, to open the
  pre-filled edit form.
- Use the checkbox to mark a task complete, and **Delete** to remove it after
  confirming.
- The list can be filtered to show all, active, or completed tasks.
- Tasks are stored in this browser's local storage on this device. Clearing
  browser data removes them; storage is not shared across browsers or devices.
