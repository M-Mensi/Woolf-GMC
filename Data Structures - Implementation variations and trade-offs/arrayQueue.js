// Array-based Queue (fixed size)

class ArrayQueue {
  constructor(capacity = 10) {
    this._items = new Array(capacity);
    this._head = 0; // index of next element to dequeue
    this._tail = 0; // index where next element will be enqueued
    this._size = 0;
    this._capacity = capacity;
  }

  enqueue(element) {
    if (this._size === this._capacity) {
      console.log("Queue is full");
      return;
    }
    this._items[this._tail] = element;
    this._tail = (this._tail + 1) % this._capacity;
    this._size += 1;
  }

  dequeue() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
      return;
    }
    const value = this._items[this._head];
    this._items[this._head] = undefined;
    this._head = (this._head + 1) % this._capacity;
    this._size -= 1;
    return value;
  }

  peek() {
    if (this.isEmpty()) {
      console.log("Queue is empty");
      return;
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
