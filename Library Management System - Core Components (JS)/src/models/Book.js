export class Book {
  constructor({ id, title, author }) {
    if (!id || !title || !author) {
      throw new Error("Book id, title, and author are required");
    }

    this.id = id;
    this.title = title;
    this.author = author;
    this.borrowedBy = null;
    this.dueDate = null;
  }

  get isAvailable() {
    return this.borrowedBy === null;
  }

  borrow(memberId, dueDate) {
    if (!this.isAvailable) {
      throw new Error(`Book "${this.title}" is already borrowed`);
    }

    this.borrowedBy = memberId;
    this.dueDate = dueDate;
  }

  return() {
    if (this.isAvailable) {
      throw new Error(`Book "${this.title}" is not borrowed`);
    }

    this.borrowedBy = null;
    this.dueDate = null;
  }
}
