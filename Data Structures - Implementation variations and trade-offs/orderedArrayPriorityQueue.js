// Ordered Array-based Priority Queue
// Maintains the underlying array sorted by priority (ascending).
// Insert is O(n) due to shifting elements, but peekMin / extractMin are O(1) or O(n) respectively.

class OrderedArrayPriorityQueue {
  constructor() {
    this._items = [];
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
      throw new Error("Priority queue is empty");
    }
    return this._items[0];
  }

  extractMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
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
