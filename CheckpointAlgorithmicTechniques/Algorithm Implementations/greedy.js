function greedyMaxTasks(tasks) {
    if (tasks.length === 0) return [];
    // Sort by end time ascending
    const sorted = [...tasks].sort((a, b) => a.end - b.end);
    const selected = [sorted[0]];
    let lastEnd = sorted[0].end;

    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].start >= lastEnd) {
            selected.push(sorted[i]);
            lastEnd = sorted[i].end;
        }
    }
    return selected;
}