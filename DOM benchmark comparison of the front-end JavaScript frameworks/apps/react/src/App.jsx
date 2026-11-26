import { useState } from "react";
import { flushSync } from "react-dom";
import { runBenchmarkSuite } from "../../../src/benchmark.js";
import "../../../styles.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ title: "", priority: "medium" });
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");
  const [results, setResults] = useState([]);
  const [heapMB, setHeapMB] = useState(null);

  const replaceTasks = async (next) => {
    flushSync(() => setTasks(next));
  };

  const addTask = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setTasks((current) => [...current, { id: crypto.randomUUID(), title: cleanTitle, priority }]);
    setTitle("");
  };

  const beginEdit = (task) => {
    setEditingId(task.id);
    setEditDraft({ title: task.title, priority: task.priority });
  };

  const saveEdit = (id) => {
    const cleanTitle = editDraft.title.trim();
    if (!cleanTitle) return;
    setTasks((current) => current.map((task) => task.id === id
      ? { ...task, title: cleanTitle, priority: editDraft.priority }
      : task));
    setEditingId(null);
  };

  const runBenchmarks = async () => {
    setRunning(true);
    setProgress("Starting benchmark…");
    try {
      const result = await runBenchmarkSuite("React", { replace: replaceTasks }, ({ operation }) => {
        setProgress(`Measured ${operation}`);
      });
      setResults(result.measurements);
      setHeapMB(result.heapMB);
      setProgress("Complete. Results saved in this browser.");
    } catch (error) {
      setProgress(`Benchmark failed: ${error.message}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <main className="app-shell">
      <div className="app-topline">
        <a className="app-back" href="../../index.html">← Framework comparison</a>
        <span className="framework-pill">React · state + components</span>
      </div>
      <h1 className="app-heading">React task board</h1>
      <p className="app-subtitle">Create, edit and remove prioritized tasks. The benchmark measures list rendering and DOM commits in this production-built app.</p>
      <div className="app-columns">
        <section className="panel" aria-labelledby="task-heading">
          <h2 id="task-heading">Your tasks</h2>
          <form className="task-form" onSubmit={addTask}>
            <label className="sr-only" htmlFor="new-task">Task name</label>
            <input id="new-task" className="field" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="What needs doing?" required />
            <label className="sr-only" htmlFor="new-priority">Priority</label>
            <select id="new-priority" className="field" value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
            </select>
            <button className="button button-primary" type="submit">Add task <span aria-hidden="true">+</span></button>
          </form>
          <p className="task-count" aria-live="polite">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</p>
          {tasks.length === 0 ? <div className="empty-list">Nothing on the list yet. Add a task or run the benchmark.</div> : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li className="task-row" key={task.id}>
                  {editingId === task.id ? (
                    <>
                      <div className="edit-fields">
                        <input className="field" aria-label="Edit task name" value={editDraft.title} onChange={(event) => setEditDraft({ ...editDraft, title: event.target.value })} maxLength={120} />
                        <select className="field" aria-label="Edit task priority" value={editDraft.priority} onChange={(event) => setEditDraft({ ...editDraft, priority: event.target.value })}>
                          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                        </select>
                      </div>
                      <div className="task-controls">
                        <button className="icon-button" type="button" onClick={() => saveEdit(task.id)}>Save</button>
                        <button className="icon-button" type="button" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="task-title">{task.title}</span>
                      <div className="task-controls">
                        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                        <button className="icon-button" type="button" onClick={() => beginEdit(task)}>Edit</button>
                        <button className="icon-button danger" type="button" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside>
          <section className="panel bench-panel">
            <h2>DOM benchmark</h2>
            <p>Three runs per operation; the median is reported. The suite creates 100, 500 and 1,000 tasks, then updates and deletes 50.</p>
            <div className="bench-actions">
              <button className="button button-primary" type="button" onClick={runBenchmarks} disabled={running}>
                {running ? "Benchmark running…" : "Run full benchmark"}
              </button>
              <span className="progress-label" role="status" aria-live="polite">{progress}</span>
            </div>
            {results.length > 0 && (
              <>
                <ul className="results-list">
                  {results.map((result) => <li key={result.operation}><span>{result.operation.replaceAll("-", " ")}</span><strong>{result.medianMs.toFixed(2)} ms</strong></li>)}
                </ul>
                <p className="memory-note">Heap after run (Chrome only): {heapMB == null ? "not exposed by this browser" : `${heapMB.toFixed(1)} MB`}</p>
              </>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}
