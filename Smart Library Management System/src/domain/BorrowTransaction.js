export class BorrowTransaction {
  #id;
  #user;
  #book;
  #borrowedAt;
  #isOverdue = false;
  #returnedAt = null;

  constructor({ id, user, book, borrowedAt = new Date() }) {
    this.#id = id;
    this.#user = user;
    this.#book = book;
    this.#borrowedAt = borrowedAt;
  }

  get id() {
    return this.#id;
  }

  get user() {
    return this.#user;
  }

  get book() {
    return this.#book;
  }

  get borrowedAt() {
    return this.#borrowedAt;
  }

  get isOverdue() {
    return this.#isOverdue;
  }

  get returnedAt() {
    return this.#returnedAt;
  }

  markOverdue(isOverdue) {
    if (this.#returnedAt) {
      throw new Error("A returned book cannot be marked overdue.");
    }
    this.#isOverdue = Boolean(isOverdue);
  }

  markReturned(returnedAt = new Date()) {
    if (this.#returnedAt) {
      throw new Error("This book has already been returned.");
    }
    this.#book.returnToLibrary();
    this.#returnedAt = returnedAt;
    this.#isOverdue = false;
  }
}
