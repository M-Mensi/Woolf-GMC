// Min-Heap-based Priority Queue
// Uses a binary min-heap stored in an array (0-based).
// The elements can be any value, but to support priorities, it expects objects like { priority, value }
// or numbers (where the number itself is treated as priority).

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
    }
    if (typeof item === "number") {
      return item;
    }
    throw new Error(
      'Element must be a number or an object with a numeric "priority" property',
    );
  }

  insert(element) {
    if (element === undefined) {
      throw new Error("Cannot insert undefined");
    }
    this._heap.push(element);
    this._siftUp(this._heap.length - 1);
  }

  peekMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }
    return this._heap[0];
  }

  extractMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
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

  _siftUp(index) {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this._compare(this._heap[i], this._heap[parent]) < 0) {
        [this._heap[i], this._heap[parent]] = [
          this._heap[parent],
          this._heap[i],
        ];
        i = parent;
      } else {
        break;
      }
    }
  }

  _siftDown(index) {
    let i = index;
    const length = this._heap.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (
        left < length &&
        this._compare(this._heap[left], this._heap[smallest]) < 0
      ) {
        smallest = left;
      }
      if (
        right < length &&
        this._compare(this._heap[right], this._heap[smallest]) < 0
      ) {
        smallest = right;
      }

      if (smallest !== i) {
        [this._heap[i], this._heap[smallest]] = [
          this._heap[smallest],
          this._heap[i],
        ];
        i = smallest;
      } else {
        break;
      }
    }
  }
}

module.exports = { MinHeapPriorityQueue };
