export class EventBus {
  #listeners = new Map();

  subscribe(eventName, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Event listener must be a function");
    }

    const listeners = this.#listeners.get(eventName) ?? new Set();
    listeners.add(listener);
    this.#listeners.set(eventName, listeners);

    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.#listeners.delete(eventName);
      }
    };
  }

  publish(eventName, payload) {
    for (const listener of this.#listeners.get(eventName) ?? []) {
      listener(payload);
    }
  }
}
