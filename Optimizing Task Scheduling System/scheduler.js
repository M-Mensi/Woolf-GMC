class Task {
  constructor(name, startTime, endTime, priority) {
    this.name = name;
    this.startTime = startTime;
    this.endTime = endTime;
    this.priority = priority;
  }

  toString() {
    return `${this.name} (${this.startTime}-${this.endTime}, ${this.priority})`;
  }

  // Check if this task overlaps with another
  overlaps(other) {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }
}

class TaskScheduler {
  constructor() {
    this.tasks = [];
    // Priority order for sorting
    this.priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
  }

  addTask(task) {
    this.tasks.push(task);
  }

  addTasks(tasks) {
    this.tasks.push(...tasks);
  }

  // Sort tasks by start time
  sortByStartTime() {
    return [...this.tasks].sort((a, b) => a.startTime - b.startTime);
  }

  //Group tasks by priority
 
  groupByPriority() {
    const groups = {
      'High': [],
      'Medium': [],
      'Low': []
    };

    for (const task of this.tasks) {
      if (groups[task.priority]) {
        groups[task.priority].push(task);
      }
    }

    return groups;
  }

  //Detect overlapping tasks
  findOverlappingTasks() {
    const sorted = this.sortByStartTime();
    const overlaps = [];

    for (let i = 0; i < sorted.length - 1; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const current = sorted[i];
        const next = sorted[j];

        // Early termination: if next starts after current ends, no overlap
        if (next.startTime >= current.endTime) break;

        if (current.overlaps(next)) {
          overlaps.push({ task1: current, task2: next });
        }
      }
    }

    return overlaps;
  }

  /**
   * Display tasks in formatted table
   */
  displayTasks() {
    console.log('\n=== All Tasks ===');
    console.log('Name'.padEnd(20), 'Start'.padEnd(8), 'End'.padEnd(8), 'Priority'.padEnd(10));
    console.log('-'.repeat(50));
    for (const task of this.tasks) {
      console.log(
        task.name.padEnd(20),
        String(task.startTime).padEnd(8),
        String(task.endTime).padEnd(8),
        task.priority.padEnd(10)
      );
    }
  }


  /**
   * Estimate memory usage in bytes
   * Approximation: each Task object ~200 bytes + string data
   */
  estimateMemoryUsage() {
    const baseTaskSize = 200; // approximate bytes per Task object
    const stringOverhead = 50; // per string property
    let totalMemory = 0;

    for (const task of this.tasks) {
      totalMemory += baseTaskSize;
      totalMemory += task.name.length;
      totalMemory += task.priority.length;
    }

    return {
      taskCount: this.tasks.length,
      estimatedBytes: totalMemory,
      estimatedKB: (totalMemory / 1024).toFixed(2),
      estimatedMB: (totalMemory / (1024 * 1024)).toFixed(4)
    };
  }
}
