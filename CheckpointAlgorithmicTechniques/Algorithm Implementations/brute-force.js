
function bruteForceMaxTasks(tasks) {
    if (tasks.length === 0) return [];
    let best = [];

    // check if a set of tasks is non-overlapping
    function isNonOverlapping(set) {
        for (let i = 0; i < set.length; i++) {
            for (let j = i + 1; j < set.length; j++) {
                if (set[i].start < set[j].end && set[j].start < set[i].end)
                    return false;
            }
        }
        return true;
    }

    // Recursive backtracking
    function backtrack(startIndex, currentSet) {
        if (startIndex === tasks.length) {
            if (currentSet.length > best.length && isNonOverlapping(currentSet)) {
                best = [...currentSet];
            }
            return;
        }
        // Exclude current task
        backtrack(startIndex + 1, currentSet);
        // Include current task
        const task = tasks[startIndex];
        const canInclude = currentSet.every(t =>
            t.end <= task.start || task.end <= t.start
        );
        if (canInclude) {
            currentSet.push(task);
            backtrack(startIndex + 1, currentSet);
            currentSet.pop();
        }
    }

    backtrack(0, []);
    return best;
}