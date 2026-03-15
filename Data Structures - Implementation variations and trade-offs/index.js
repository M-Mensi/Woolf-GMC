// Example usage for the implemented data structures.

const { ArrayQueue } = require("./arrayQueue");
const { LinkedListQueue } = require("./linkedListQueue");
const { MinHeapPriorityQueue } = require("./minHeapPriorityQueue");
const { OrderedArrayPriorityQueue } = require("./orderedArrayPriorityQueue");

function runExamples() {
  console.log("--- ArrayQueue (fixed size) ---");
  const aQueue = new ArrayQueue(3);
  aQueue.enqueue("a");
  aQueue.enqueue("b");
  aQueue.enqueue("c");
  console.log("peek", aQueue.peek());
  console.log("dequeue", aQueue.dequeue());
  console.log("dequeue", aQueue.dequeue());
  console.log("dequeue", aQueue.dequeue());

  console.log("\n--- LinkedListQueue (dynamic) ---");
  const llQueue = new LinkedListQueue();
  llQueue.enqueue(1);
  llQueue.enqueue(2);
  llQueue.enqueue(3);
  console.log("peek", llQueue.peek());
  console.log("dequeue", llQueue.dequeue());
  console.log("dequeue", llQueue.dequeue());
  console.log("dequeue", llQueue.dequeue());

  console.log("\n--- MinHeapPriorityQueue ---");
  const minHeap = new MinHeapPriorityQueue();
  minHeap.insert({ priority: 5, value: "low" });
  minHeap.insert({ priority: 2, value: "high" });
  minHeap.insert({ priority: 3, value: "medium" });
  console.log("peekMin", minHeap.peekMin());
  console.log("extractMin", minHeap.extractMin());
  console.log("extractMin", minHeap.extractMin());
  console.log("extractMin", minHeap.extractMin());

  console.log("\n--- OrderedArrayPriorityQueue ---");
  const ordered = new OrderedArrayPriorityQueue();
  ordered.insert({ priority: 4, value: "d" });
  ordered.insert({ priority: 1, value: "a" });
  ordered.insert({ priority: 3, value: "c" });
  console.log("peekMin", ordered.peekMin());
  console.log("extractMin", ordered.extractMin());
  console.log("extractMin", ordered.extractMin());
  console.log("extractMin", ordered.extractMin());
}

if (require.main === module) {
  runExamples();
}

module.exports = {
  ArrayQueue,
  LinkedListQueue,
  MinHeapPriorityQueue,
  OrderedArrayPriorityQueue,
};
