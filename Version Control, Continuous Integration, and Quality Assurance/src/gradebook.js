function validateScore(score, label) {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new RangeError(`${label} must be a finite number from 0 to 100.`);
  }
}

export function parseScores(inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw new TypeError("At least one score is required.");
  }

  return inputs.map((input, index) => {
    const value = typeof input === "string" ? input.trim() : "";
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) {
      throw new TypeError(`Score ${index + 1} must be a decimal number.`);
    }

    const score = Number(value);
    validateScore(score, `Score ${index + 1}`);
    return score;
  });
}

export function calculateAverage(scores) {
  if (!Array.isArray(scores) || scores.length === 0) {
    throw new TypeError("At least one score is required.");
  }

  let total = 0;
  for (let index = 0; index < scores.length; index += 1) {
    const score = scores[index];
    validateScore(score, `Score ${index + 1}`);
    total += score;
  }
  return Number((total / scores.length).toFixed(2));
}

export function letterGrade(score) {
  validateScore(score, "Score");

  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function summarizeStudent(name, scores) {
  if (typeof name !== "string" || name.trim().length === 0) {
    throw new TypeError("Student name is required.");
  }

  const average = calculateAverage(scores);
  return {
    name: name.trim(),
    average,
    letter: letterGrade(average)
  };
}
