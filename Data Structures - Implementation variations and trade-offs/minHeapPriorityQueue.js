// Min-Heap-based Priority Queue

class MinHeapPriorityQueue {
  constructor() {
    this._heap = [];
  }

  _compare(a, b) {
    const aPri = this._getPriority(a);
    const bPri = this._getPriority(b);
    return aPri - bPri;
  }

  _getPriority(item) {
    if (item && typeof item === "object" && "priority" in item) {
      return item.priority;
    } else {
      console.log("Invalid item for priority queue.");
    }
  }

  insert(element) {
    this._heap.push(element);
    this._siftUp(this._heap.length - 1);
  }

  peekMin() {
    if (this.isEmpty()) {
      console.log("Priority queue is empty");
      return;
    }
    return this._heap[0];
  }

  extractMin() {
    if (this.isEmpty()) {
      console.log("Priority queue is empty");
      return;
    }
    const min = this._heap[0];
    const last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._siftDown(0);
    }
    return min;
  }

  isEmpty() {
    return this._heap.length === 0;
  }

  size() {
    return this._heap.length;
  }
}

module.exports = { MinHeapPriorityQueue };
