import test from "node:test";
import assert from "node:assert/strict";
import { calculateAverage, letterGrade, parseScores, summarizeStudent } from "../src/gradebook.js";

test("calculateAverage returns a two-decimal mean", () => {
  assert.equal(calculateAverage([90, 80, 89]), 86.33);
});

test("calculateAverage rejects missing, empty, and invalid scores", () => {
  assert.throws(() => calculateAverage([]), TypeError);
  assert.throws(() => calculateAverage(null), TypeError);
  assert.throws(() => calculateAverage(Array(1)), RangeError);
  for (const score of [-1, 101, Number.NaN, Number.POSITIVE_INFINITY, "90"]) {
    assert.throws(() => calculateAverage([score]), RangeError);
  }
});

test("parseScores accepts decimal scores and rejects blank or non-decimal input", () => {
  assert.deepEqual(parseScores(["90", " 84.5 ", ".5"]), [90, 84.5, 0.5]);
  assert.throws(() => parseScores([]), TypeError);
  assert.throws(() => parseScores([""]), TypeError);
  assert.throws(() => parseScores(["0x10"]), TypeError);
  assert.throws(() => parseScores(["101"]), RangeError);
});

test("letterGrade assigns the expected grade at each cutoff", () => {
  const cases = [
    [90, "A"],
    [80, "B"],
    [70, "C"],
    [60, "D"],
    [59.99, "F"]
  ];

  for (const [score, expected] of cases) {
    assert.equal(letterGrade(score), expected);
  }
});

test("letterGrade rejects values outside the score range", () => {
  assert.throws(() => letterGrade(-0.1), RangeError);
  assert.throws(() => letterGrade(100.1), RangeError);
});

test("summarizeStudent trims the name and summarizes the average", () => {
  assert.deepEqual(summarizeStudent("  Sam Lee  ", [84, 86]), {
    name: "Sam Lee",
    average: 85,
    letter: "B"
  });
});

test("summarizeStudent rejects blank names", () => {
  assert.throws(() => summarizeStudent("   ", [90]), TypeError);
});
