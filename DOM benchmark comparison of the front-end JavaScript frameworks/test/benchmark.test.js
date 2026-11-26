import test from "node:test";
import assert from "node:assert/strict";
import { makeTasks, median } from "../src/benchmark.js";

test("task generator creates stable, distinct records at each benchmark size", () => {
  for (const size of [100, 500, 1000]) {
    const tasks = makeTasks(size);
    assert.equal(tasks.length, size);
    assert.equal(new Set(tasks.map((task) => task.id)).size, size);
    assert.equal(tasks[0].title, "Benchmark task 0001");
    assert.deepEqual(tasks.slice(0, 3).map((task) => task.priority), ["low", "medium", "high"]);
  }
});

test("median handles odd and even sample counts", () => {
  assert.equal(median([9, 1, 5]), 5);
  assert.equal(median([8, 2, 4, 6]), 5);
});
