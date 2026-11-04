export class InMemoryRepository {
  #items = new Map();

  constructor(items = []) {
    for (const item of items) {
      this.save(item);
    }
  }

  getById(id) {
    return this.#items.get(id) ?? null;
  }

  save(item) {
    if (!item?.id) {
      throw new Error("Repository items must have an id");
    }
    this.#items.set(item.id, item);
    return item;
  }

  getAll() {
    return [...this.#items.values()];
  }
}
