import { Book } from "./Book.js";
import { BorrowTransaction } from "./BorrowTransaction.js";
import { UserFactory } from "./UserFactory.js";

export class LibrarySystem {
  static #instance;
  #users = [];
  #books = [];
  #transactions = [];

  constructor() {
    if (LibrarySystem.#instance) {
      throw new Error("Use LibrarySystem.getInstance() to access the library.");
    }
    LibrarySystem.#instance = this;
  }

  static getInstance() {
    if (!LibrarySystem.#instance) {
      LibrarySystem.#instance = new LibrarySystem();
    }
    return LibrarySystem.#instance;
  }

  get users() {
    return [...this.#users];
  }

  get books() {
    return [...this.#books];
  }

  get transactions() {
    return [...this.#transactions];
  }

  addUser(type, details) {
    const user = UserFactory.createUser(type, details);
    this.#users.push(user);
    return user;
  }

  addBook(details) {
    const book = new Book(details);
    this.#books.push(book);
    return book;
  }

  borrowBook(userId, bookId) {
    const user = this.#users.find((item) => item.id === userId);
    const book = this.#books.find((item) => item.id === bookId);

    if (!user) {
      throw new Error("Select a library member before borrowing.");
    }
    if (!book) {
      throw new Error("Select a book before borrowing.");
    }

    book.borrow();
    const transaction = new BorrowTransaction({
      id: crypto.randomUUID(),
      user,
      book,
    });
    this.#transactions.push(transaction);
    return transaction;
  }

  returnBook(transactionId) {
    const transaction = this.#transactions.find(
      (item) => item.id === transactionId && !item.returnedAt,
    );
    if (!transaction) {
      throw new Error("This borrowed book could not be found.");
    }

    transaction.markReturned();
    return transaction;
  }
}
