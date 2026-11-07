function generateReport(name, scores) {
  if (!Array.isArray(scores) || scores.length === 0) {
    throw new TypeError('scores must be a non-empty array of numbers');
  }

  if (!scores.every((score) => typeof score === 'number' && Number.isFinite(score))) {
    throw new TypeError('scores must contain only finite numbers');
  }

  const average = scores.reduce((total, score) => total + score, 0) / scores.length;
  const status = average >= 10 ? 'Pass' : 'Fail';

  return `Student: ${name}\nAverage score: ${average.toFixed(2)}\nStatus: ${status}`;
}

module.exports = generateReport;