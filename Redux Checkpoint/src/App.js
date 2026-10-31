import { useState } from "react";
import { useSelector } from "react-redux";
import Addtask from "./components/Addtask";
import ListTask from "./components/ListTask";
import "./App.css";

// Show the application and let the user filter the Redux-managed tasks.
function App() {
  const [filter, setFilter] = useState("all");
  const tasks = useSelector((state) => state.tasks);

  const filteredTasks = tasks.filter((task) => {
    if (filter === "done") return task.isDone;
    if (filter === "not-done") return !task.isDone;
    return true;
  });

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">Keep your day moving</p>
        <h1>My To-Do List</h1>
        <p className="page-subtitle">
          Add tasks, mark them done, and update them whenever plans change.
        </p>
      </header>

      <section className="task-panel" aria-label="Task manager">
        <Addtask />

        <div className="list-heading">
          <div>
            <h2>Your tasks</h2>
            <p>
              {tasks.filter((task) => task.isDone).length} of {tasks.length}{" "}
              completed
            </p>
          </div>
          <label className="filter-control">
            <span>Show</span>
            <select
              aria-label="Filter tasks"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All tasks</option>
              <option value="not-done">Not done</option>
              <option value="done">Done</option>
            </select>
          </label>
        </div>

        <ListTask tasks={filteredTasks} />
      </section>
      <footer className="page-footer">Your task list is ready when you are.</footer>
    </main>
  );
}

export default App;
