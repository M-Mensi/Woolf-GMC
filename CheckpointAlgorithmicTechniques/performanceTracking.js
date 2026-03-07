function generateRandomTasks(n) {
    const tasks = [];
    for (let i = 0; i < n; i++) {
        const start = Math.floor(Math.random() * 1000);
        const end = start + Math.floor(Math.random() * 100) + 1; // ensure end > start
        tasks.push({ start, end });
    }
    return tasks;
}

const largeTasks = generateRandomTasks(10000);

console.time("Greedy");
const greedyResult = greedyMaxTasks(largeTasks);
console.timeEnd("Greedy");

console.time("Brute-force");
const bruteForceResult = bruteForceMaxTasks(largeTasks);
console.timeEnd("Brute-force");