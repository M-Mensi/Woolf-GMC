// Linked List-based Queue (dynamic size)
// Uses a singly linked list to allow unbounded growth.

class LinkedListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedListQueue {
  constructor() {
    this._head = null; // front of the queue
    this._tail = null; // end of the queue
    this._size = 0;
  }

  enqueue(element) {
    const node = new LinkedListNode(element);
    if (!this._head) {
      // empty queue
      this._head = node;
      this._tail = node;
    } else {
      this._tail.next = node;
      this._tail = node;
    }
    this._size += 1;
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const value = this._head.value;
    this._head = this._head.next;
    if (!this._head) {
      // queue became empty
      this._tail = null;
    }
    this._size -= 1;
    return value;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this._head.value;
  }

  isEmpty() {
    return this._size === 0;
  }

  size() {
    return this._size;
  }
}

module.exports = { LinkedListQueue };
