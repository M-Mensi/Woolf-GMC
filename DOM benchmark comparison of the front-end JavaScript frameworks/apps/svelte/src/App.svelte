<script>
  import { tick } from "svelte";
  import { runBenchmarkSuite } from "../../../src/benchmark.js";
  import "../../../styles.css";

  let tasks = $state([]);
  let title = $state("");
  let priority = $state("medium");
  let editingId = $state(null);
  let editDraft = $state({ title: "", priority: "medium" });
  let running = $state(false);
  let progress = $state("");
  let results = $state([]);
  let heapMB = $state(null);

  async function replaceTasks(next) {
    tasks = next;
    await tick();
  }

  function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    tasks = [...tasks, { id: crypto.randomUUID(), title: cleanTitle, priority }];
    title = "";
  }

  function beginEdit(task) {
    editingId = task.id;
    editDraft = { title: task.title, priority: task.priority };
  }

  function saveEdit(id) {
    const cleanTitle = editDraft.title.trim();
    if (!cleanTitle) return;
    tasks = tasks.map((task) => task.id === id
      ? { ...task, title: cleanTitle, priority: editDraft.priority }
      : task);
    editingId = null;
  }

  async function runBenchmarks() {
    running = true;
    progress = "Starting benchmark…";
    try {
      const result = await runBenchmarkSuite("Svelte", { replace: replaceTasks }, ({ operation }) => {
        progress = `Measured ${operation}`;
      });
      results = result.measurements;
      heapMB = result.heapMB;
      progress = "Complete. Results saved in this browser.";
    } catch (error) {
      progress = `Benchmark failed: ${error.message}`;
    } finally {
      running = false;
    }
  }
</script>

<main class="app-shell">
  <div class="app-topline">
    <a class="app-back" href="../../index.html">← Framework comparison</a>
    <span class="framework-pill">Svelte · compiler + keyed each</span>
  </div>
  <h1 class="app-heading">Svelte task board</h1>
  <p class="app-subtitle">Create, edit and remove prioritized tasks. The benchmark measures list rendering and DOM commits in this production-built app.</p>
  <div class="app-columns">
    <section class="panel" aria-labelledby="task-heading">
      <h2 id="task-heading">Your tasks</h2>
      <form class="task-form" onsubmit={addTask}>
        <label class="sr-only" for="new-task">Task name</label>
        <input id="new-task" bind:value={title} class="field" maxlength="120" placeholder="What needs doing?" required>
        <label class="sr-only" for="new-priority">Priority</label>
        <select id="new-priority" bind:value={priority} class="field">
          <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
        </select>
        <button class="button button-primary" type="submit">Add task <span aria-hidden="true">+</span></button>
      </form>
      <p class="task-count" aria-live="polite">{tasks.length} {tasks.length === 1 ? "task" : "tasks"}</p>
      {#if tasks.length === 0}
        <div class="empty-list">Nothing on the list yet. Add a task or run the benchmark.</div>
      {:else}
        <ul class="task-list">
          {#each tasks as task (task.id)}
            <li class="task-row">
              {#if editingId === task.id}
                <div class="edit-fields">
                  <input bind:value={editDraft.title} class="field" aria-label="Edit task name" maxlength="120">
                  <select bind:value={editDraft.priority} class="field" aria-label="Edit task priority">
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div class="task-controls">
                  <button class="icon-button" type="button" onclick={() => saveEdit(task.id)}>Save</button>
                  <button class="icon-button" type="button" onclick={() => editingId = null}>Cancel</button>
                </div>
              {:else}
                <span class="task-title">{task.title}</span>
                <div class="task-controls">
                  <span class="priority priority-{task.priority}">{task.priority}</span>
                  <button class="icon-button" type="button" onclick={() => beginEdit(task)}>Edit</button>
                  <button class="icon-button danger" type="button" onclick={() => tasks = tasks.filter((item) => item.id !== task.id)}>Delete</button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>
    <aside>
      <section class="panel bench-panel">
        <h2>DOM benchmark</h2>
        <p>Three runs per operation; the median is reported. The suite creates 100, 500 and 1,000 tasks, then updates and deletes 50.</p>
        <div class="bench-actions">
          <button class="button button-primary" type="button" onclick={runBenchmarks} disabled={running}>
            {running ? "Benchmark running…" : "Run full benchmark"}
          </button>
          <span class="progress-label" role="status" aria-live="polite">{progress}</span>
        </div>
        {#if results.length}
          <ul class="results-list">
            {#each results as result (result.operation)}
              <li><span>{result.operation.replaceAll("-", " ")}</span><strong>{result.medianMs.toFixed(2)} ms</strong></li>
            {/each}
          </ul>
          <p class="memory-note">Heap after run (Chrome only): {heapMB == null ? "not exposed by this browser" : `${heapMB.toFixed(1)} MB`}</p>
        {/if}
      </section>
    </aside>
  </div>
</main>
