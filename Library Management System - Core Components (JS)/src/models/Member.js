export class Member {
  constructor({ id, name, type = "standard", borrowLimit = 3 }) {
    if (!id || !name) {
      throw new Error("Member id and name are required");
    }
    if (!Number.isInteger(borrowLimit) || borrowLimit < 1) {
      throw new Error("Member borrow limit must be a positive integer");
    }

    this.id = id;
    this.name = name;
    this.type = type;
    this.borrowLimit = borrowLimit;
    this.borrowedBookIds = [];
  }

  addBorrowedBook(bookId) {
    if (this.borrowedBookIds.includes(bookId)) {
      throw new Error(`Member already borrowed book "${bookId}"`);
    }
    this.borrowedBookIds.push(bookId);
  }

  removeBorrowedBook(bookId) {
    const index = this.borrowedBookIds.indexOf(bookId);
    if (index === -1) {
      throw new Error(`Member has not borrowed book "${bookId}"`);
    }
    this.borrowedBookIds.splice(index, 1);
  }
}
