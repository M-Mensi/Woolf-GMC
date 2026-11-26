<script setup>
import { computed, nextTick, ref } from "vue";
import { runBenchmarkSuite } from "../../../src/benchmark.js";
import "../../../styles.css";

const tasks = ref([]);
const title = ref("");
const priority = ref("medium");
const editingId = ref(null);
const editDraft = ref({ title: "", priority: "medium" });
const running = ref(false);
const progress = ref("");
const results = ref([]);
const heapMB = ref(null);
const taskCount = computed(() => tasks.value.length);

async function replaceTasks(next) {
  tasks.value = next;
  await nextTick();
}

function addTask() {
  const cleanTitle = title.value.trim();
  if (!cleanTitle) return;
  tasks.value.push({ id: crypto.randomUUID(), title: cleanTitle, priority: priority.value });
  title.value = "";
}

function beginEdit(task) {
  editingId.value = task.id;
  editDraft.value = { title: task.title, priority: task.priority };
}

function saveEdit(task) {
  const cleanTitle = editDraft.value.title.trim();
  if (!cleanTitle) return;
  task.title = cleanTitle;
  task.priority = editDraft.value.priority;
  editingId.value = null;
}

async function runBenchmarks() {
  running.value = true;
  progress.value = "Starting benchmark…";
  try {
    const result = await runBenchmarkSuite("Vue", { replace: replaceTasks }, ({ operation }) => {
      progress.value = `Measured ${operation}`;
    });
    results.value = result.measurements;
    heapMB.value = result.heapMB;
    progress.value = "Complete. Results saved in this browser.";
  } catch (error) {
    progress.value = `Benchmark failed: ${error.message}`;
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <main class="app-shell">
    <div class="app-topline">
      <a class="app-back" href="../../index.html">← Framework comparison</a>
      <span class="framework-pill">Vue · reactivity + directives</span>
    </div>
    <h1 class="app-heading">Vue task board</h1>
    <p class="app-subtitle">Create, edit and remove prioritized tasks. The benchmark measures list rendering and DOM commits in this production-built app.</p>
    <div class="app-columns">
      <section class="panel" aria-labelledby="task-heading">
        <h2 id="task-heading">Your tasks</h2>
        <form class="task-form" @submit.prevent="addTask">
          <label class="sr-only" for="new-task">Task name</label>
          <input id="new-task" v-model="title" class="field" maxlength="120" placeholder="What needs doing?" required>
          <label class="sr-only" for="new-priority">Priority</label>
          <select id="new-priority" v-model="priority" class="field">
            <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
          </select>
          <button class="button button-primary" type="submit">Add task <span aria-hidden="true">+</span></button>
        </form>
        <p class="task-count" aria-live="polite">{{ taskCount }} {{ taskCount === 1 ? "task" : "tasks" }}</p>
        <div v-if="tasks.length === 0" class="empty-list">Nothing on the list yet. Add a task or run the benchmark.</div>
        <ul v-else class="task-list">
          <li v-for="task in tasks" :key="task.id" class="task-row">
            <template v-if="editingId === task.id">
              <div class="edit-fields">
                <input v-model="editDraft.title" class="field" aria-label="Edit task name" maxlength="120">
                <select v-model="editDraft.priority" class="field" aria-label="Edit task priority">
                  <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                </select>
              </div>
              <div class="task-controls">
                <button class="icon-button" type="button" @click="saveEdit(task)">Save</button>
                <button class="icon-button" type="button" @click="editingId = null">Cancel</button>
              </div>
            </template>
            <template v-else>
              <span class="task-title">{{ task.title }}</span>
              <div class="task-controls">
                <span :class="`priority priority-${task.priority}`">{{ task.priority }}</span>
                <button class="icon-button" type="button" @click="beginEdit(task)">Edit</button>
                <button class="icon-button danger" type="button" @click="tasks = tasks.filter((item) => item.id !== task.id)">Delete</button>
              </div>
            </template>
          </li>
        </ul>
      </section>
      <aside>
        <section class="panel bench-panel">
          <h2>DOM benchmark</h2>
          <p>Three runs per operation; the median is reported. The suite creates 100, 500 and 1,000 tasks, then updates and deletes 50.</p>
          <div class="bench-actions">
            <button class="button button-primary" type="button" :disabled="running" @click="runBenchmarks">
              {{ running ? "Benchmark running…" : "Run full benchmark" }}
            </button>
            <span class="progress-label" role="status" aria-live="polite">{{ progress }}</span>
          </div>
          <ul v-if="results.length" class="results-list">
            <li v-for="result in results" :key="result.operation"><span>{{ result.operation.replaceAll("-", " ") }}</span><strong>{{ result.medianMs.toFixed(2) }} ms</strong></li>
          </ul>
          <p v-if="results.length" class="memory-note">Heap after run (Chrome only): {{ heapMB == null ? "not exposed by this browser" : `${heapMB.toFixed(1)} MB` }}</p>
        </section>
      </aside>
    </div>
  </main>
</template>
