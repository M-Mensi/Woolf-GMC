import { parseScores, summarizeStudent } from "./gradebook.js";

const [name, ...scoreArguments] = process.argv.slice(2);

if (!name || scoreArguments.length === 0) {
  console.error('Usage: npm start -- "Student Name" <score> [score ...]');
  process.exitCode = 2;
} else {
  try {
    const scores = parseScores(scoreArguments);
    const summary = summarizeStudent(name, scores);
    console.log(`${summary.name}: ${summary.average.toFixed(2)}% (${summary.letter})`);
  } catch (error) {
    console.error(`Unable to create grade summary: ${error.message}`);
    process.exitCode = 1;
  }
}
