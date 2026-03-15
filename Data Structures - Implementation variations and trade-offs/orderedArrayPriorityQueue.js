// Ordered Array-based Priority Queue

class OrderedArrayPriorityQueue {
  constructor() {
    this._items = [];
  }

  _getPriority(item) {
    if (item && typeof item === "object" && "priority" in item) {
      return item.priority;
    } else {
      console.log("Invalid item for priority queue.");
    }
  }

  insert(element) {
    const priority = this._getPriority(element);
    // find insertion point (first element with strictly greater priority)
    let i = 0;
    while (
      i < this._items.length &&
      this._getPriority(this._items[i]) <= priority
    ) {
      i += 1;
    }
    this._items.splice(i, 0, element);
  }

  peekMin() {
    if (this.isEmpty()) {
      console.log("Priority queue is empty");
      return;
    }
    return this._items[0];
  }

  extractMin() {
    if (this.isEmpty()) {
      console.log("Priority queue is empty");
      return;
    }
    return this._items.shift();
  }

  isEmpty() {
    return this._items.length === 0;
  }

  size() {
    return this._items.length;
  }
}

module.exports = { OrderedArrayPriorityQueue };
