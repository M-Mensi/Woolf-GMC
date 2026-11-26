export const RESULT_KEY = "dom-framework-benchmark-v1";
export const SAMPLE_COUNT = 3;
export const BENCHMARK_SIZES = [100, 500, 1000];

/**
 * @typedef {{ id: number, title: string, priority: "low" | "medium" | "high" }} BenchmarkTask
 * @typedef {{ operation: string, samplesMs: number[], medianMs: number }} BenchmarkMeasurement
 * @typedef {{
 *   framework: string,
 *   timestamp: string,
 *   userAgent: string,
 *   sampleCount: number,
 *   timing: string,
 *   measurements: BenchmarkMeasurement[],
 *   heapMB: number | null
 * }} BenchmarkRun
 */

export function makeTasks(count) {
  const priorities = ["low", "medium", "high"];
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Benchmark task ${String(index + 1).padStart(4, "0")}`,
    priority: priorities[index % priorities.length]
  }));
}

export function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function readHeapMB() {
  const memory = performance.memory;
  return memory && Number.isFinite(memory.usedJSHeapSize)
    ? memory.usedJSHeapSize / (1024 * 1024)
    : null;
}

/**
 * @param {string} framework
 * @param {{ replace: (tasks: BenchmarkTask[]) => Promise<void> }} actions
 * @param {(progress: { operation: string, medianMs: number }) => void} [onProgress]
 * @returns {Promise<BenchmarkRun>}
 */
export async function runBenchmarkSuite(framework, actions, onProgress = () => {}) {
  const measurements = [];
  const measure = async (operation, prepare, update) => {
    const samples = [];
    for (let run = 0; run < SAMPLE_COUNT; run += 1) {
      await prepare();
      const start = performance.now();
      await update();
      void document.body.offsetHeight;
      samples.push(performance.now() - start);
    }
    const medianMs = median(samples);
    measurements.push({ operation, samplesMs: samples.map((value) => Number(value.toFixed(3))), medianMs });
    onProgress({ operation, medianMs });
  };

  await actions.replace(makeTasks(20));
  await actions.replace([]);

  for (const size of BENCHMARK_SIZES) {
    const dataset = makeTasks(size);
    await measure(
      `render-${size}`,
      () => actions.replace([]),
      () => actions.replace(dataset)
    );
  }

  const baseline = makeTasks(1000);
  const updated = baseline.map((task, index) => index < 50
    ? { ...task, title: `${task.title} · updated`, priority: "high" }
    : task);
  const deleted = baseline.slice(50);

  await measure(
    "update-50",
    () => actions.replace(baseline),
    () => actions.replace(updated)
  );
  await measure(
    "delete-50",
    () => actions.replace(baseline),
    () => actions.replace(deleted)
  );

  const result = {
    framework,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    sampleCount: SAMPLE_COUNT,
    timing: "performance.now() from state update through framework commit and forced document layout; median of three runs",
    measurements,
    heapMB: readHeapMB()
  };

  const parsed = JSON.parse(localStorage.getItem(RESULT_KEY) || "[]");
  if (!Array.isArray(parsed)) {
    throw new TypeError("Saved benchmark data has an invalid format. Clear saved runs and try again.");
  }
  const saved = parsed;
  saved.push(result);
  localStorage.setItem(RESULT_KEY, JSON.stringify(saved));
  return result;
}
