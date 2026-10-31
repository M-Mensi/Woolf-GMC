import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

const STORAGE_KEY = "managing-state-react-tasks";
let fallbackId = 0;

// Use browser UUIDs when available, with a unique per-session fallback for older runtimes.
function createTaskId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  fallbackId += 1;
  return `${Date.now()}-${fallbackId}`;
}

// Load saved tasks once when the app starts and report unreadable browser data.
function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (!savedTasks) return [];

    const tasks = JSON.parse(savedTasks);
    if (!Array.isArray(tasks)) {
      throw new Error("Saved tasks must be a list.");
    }

    return tasks.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.name === "string" &&
        typeof task.description === "string" &&
        typeof task.completed === "boolean",
    );
  } catch (error) {
    console.error("Could not load saved tasks from browser storage.", error);
    return [];
  }
}

// Keep task changes available after the browser is closed or refreshed.
function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks to browser storage.", error);
  }
}

// Owns the task state and coordinates creation, editing, filtering, and storage.
function App() {
  const [tasks, setTasks] = useState(loadTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Create a task with its initial active status.
  function addTask(taskDetails) {
    const task = {
      ...taskDetails,
      id: createTaskId(),
      completed: false,
    };
    setTasks((currentTasks) => [task, ...currentTasks]);
  }

  // Update task text while preserving its completion status and identity.
  function updateTask(taskDetails) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === editingTask.id ? { ...task, ...taskDetails } : task,
      ),
    );
    setEditingTask(null);
  }

  // Flip a task's completion status.
  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  // Ask for confirmation before removing a task permanently.
  function deleteTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || !window.confirm(`Delete "${task.name}"?`)) return;

    setTasks((currentTasks) =>
      currentTasks.filter((item) => item.id !== taskId),
    );
    if (editingTask?.id === taskId) setEditingTask(null);
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">A little more focus, every day</p>
        <h1>My Tasks</h1>
        <p className="page-subtitle">
          Capture what needs doing, then celebrate what you finish.
        </p>
      </header>

      <section className="task-panel" aria-label="Task manager">
        <TaskForm
          key={editingTask?.id ?? "new-task"}
          initialTask={editingTask}
          onSubmit={editingTask ? updateTask : addTask}
          onCancel={() => setEditingTask(null)}
        />

        <div className="list-heading">
          <div>
            <h2>Your list</h2>
            <p>
              {completedCount} of {tasks.length}{" "}
              {tasks.length === 1 ? "task" : "tasks"} completed
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </label>
        </div>

        <TaskList
          tasks={visibleTasks}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onToggle={toggleTask}
        />
      </section>
    </main>
  );
}

export default App;
