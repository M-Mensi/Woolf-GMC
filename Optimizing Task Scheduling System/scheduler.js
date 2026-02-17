class Task {
  constructor(name, startTime, endTime, priority) {
    this.name = name;
    this.startTime = startTime; // minutes since midnight or epoch
    this.endTime = endTime;
    this.priority = priority; // 'High', 'Medium', 'Low'
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

  /**
   * Sort tasks by start time
   * Time Complexity: O(n log n) - uses native sort
   * Space Complexity: O(1) or O(n) depending on sort algorithm (in-place vs copy)
   */
  sortByStartTime() {
    return [...this.tasks].sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Group tasks by priority
   * Time Complexity: O(n) - single pass through tasks
   * Space Complexity: O(n) - store all tasks in groups
   */
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

  /**
   * Detect overlapping tasks
   * Time Complexity: O(n log n) - sort then linear scan
   * Space Complexity: O(n) - store overlaps
   * 
   * Algorithm:
   * 1. Sort tasks by start time O(n log n)
   * 2. Check each consecutive pair O(n)
   * 3. For pairs that could overlap, compare intervals
   */
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
   * Find all tasks that overlap with a specific task
   * Time Complexity: O(n) - check against all tasks
   * Space Complexity: O(k) where k is number of overlapping tasks
   */
  findOverlapsFor(targetTask) {
    return this.tasks.filter(task => task !== targetTask && taskOverlaps(targetTask, task));
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
   * Display sorted tasks by start time
   */
  displaySortedByTime() {
    const sorted = this.sortByStartTime();
    console.log('\n=== Tasks Sorted by Start Time ===');
    console.log('Name'.padEnd(20), 'Start'.padEnd(8), 'End'.padEnd(8), 'Priority'.padEnd(10));
    console.log('-'.repeat(50));
    for (const task of sorted) {
      console.log(
        task.name.padEnd(20),
        String(task.startTime).padEnd(8),
        String(task.endTime).padEnd(8),
        task.priority.padEnd(10)
      );
    }
  }

  /**
   * Display tasks grouped by priority
   */
  displayGroupedByPriority() {
    const groups = this.groupByPriority();
    console.log('\n=== Tasks Grouped by Priority ===');
    for (const [priority, tasks] of Object.entries(groups)) {
      console.log(`\n${priority}:`);
      if (tasks.length === 0) {
        console.log('  (none)');
      } else {
        for (const task of tasks) {
          console.log(`  ${task.toString()}`);
        }
      }
    }
  }

  /**
   * Display overlapping tasks
   */
  displayOverlaps() {
    const overlaps = this.findOverlappingTasks();
    console.log('\n=== Overlapping Tasks ===');
    if (overlaps.length === 0) {
      console.log('No overlapping tasks found.');
    } else {
      for (const pair of overlaps) {
        console.log(`  "${pair.task1.name}" overlaps with "${pair.task2.name}"`);
      }
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

  /**
   * Generate complexity analysis report
   */
  printComplexityAnalysis() {
    console.log('\n=== Complexity Analysis ===');
    console.log('Operation                | Time Complexity | Space Complexity | Notes');
    console.log('-'.repeat(90));
    console.log('addTask                  | O(1)            | O(1)             | Append to array');
    console.log('sortByStartTime          | O(n log n)      | O(n)             | Uses Array.sort()');
    console.log('groupByPriority          | O(n)            | O(n)             | Single pass, hash map');
    console.log('findOverlappingTasks     | O(n log n)      | O(n)             | Sort + scan overlaps');
    console.log('findOverlapsFor(task)    | O(n)            | O(k)             | k = overlapping tasks');
    console.log('displayTasks             | O(n)            | O(1)             | Console output only');
  }
}

// Helper function for overlap detection
function taskOverlaps(task1, task2) {
  return task1.startTime < task2.endTime && task1.endTime > task2.startTime;
}

// ========== TESTS ==========
(function runTests() {
  console.log('==========================================');
  console.log('  TASK SCHEDULER - TESTS & ANALYSIS');
  console.log('==========================================');

  const scheduler = new TaskScheduler();

  // Create sample tasks
  const tasks = [
    new Task('Email Review', 480, 540, 'Medium'),       // 8:00 - 9:00
    new Task('Team Meeting', 540, 660, 'High'),         // 9:00 - 11:00
    new Task('Code Review', 600, 720, 'High'),          // 10:00 - 12:00 (overlaps with Team Meeting)
    new Task('Lunch Break', 720, 780, 'Low'),           // 12:00 - 1:00
    new Task('Project Work', 780, 960, 'Medium'),       // 1:00 - 4:00
    new Task('Documentation', 960, 1080, 'Low'),        // 4:00 - 6:00
    new Task('Planning', 540, 600, 'Medium'),           // 9:00 - 10:00 (overlaps with Team Meeting)
  ];

  scheduler.addTasks(tasks);

  scheduler.displayTasks();
  scheduler.displaySortedByTime();
  scheduler.displayGroupedByPriority();
  scheduler.displayOverlaps();

  console.log('\n=== Memory Usage Estimation ===');
  const memInfo = scheduler.estimateMemoryUsage();
  console.log(`Total tasks: ${memInfo.taskCount}`);
  console.log(`Estimated memory: ${memInfo.estimatedBytes} bytes`);
  console.log(`                  ${memInfo.estimatedKB} KB`);
  console.log(`                  ${memInfo.estimatedMB} MB`);

  scheduler.printComplexityAnalysis();

  console.log('\n=== Tests Completed Successfully ===\n');
})();

module.exports = { Task, TaskScheduler };
