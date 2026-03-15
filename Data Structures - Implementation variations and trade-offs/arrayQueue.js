// Array-based Queue (fixed size)
// Implements a circular buffer to utilize the fixed-size array efficiently.

class ArrayQueue {
  /**
   * @param {number} capacity
   */
  constructor(capacity = 10) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }
    this._items = new Array(capacity);
    this._head = 0; // index of next element to dequeue
    this._tail = 0; // index where next element will be enqueued
    this._size = 0;
    this._capacity = capacity;
  }

  enqueue(element) {
    if (this._size === this._capacity) {
      throw new Error("Queue is full");
    }
    this._items[this._tail] = element;
    this._tail = (this._tail + 1) % this._capacity;
    this._size += 1;
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const value = this._items[this._head];
    this._items[this._head] = undefined;
    this._head = (this._head + 1) % this._capacity;
    this._size -= 1;
    return value;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this._items[this._head];
  }

  isEmpty() {
    return this._size === 0;
  }

  size() {
    return this._size;
  }

  capacity() {
    return this._capacity;
  }
}

module.exports = { ArrayQueue };
