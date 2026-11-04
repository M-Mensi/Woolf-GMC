import { addDays } from "../utils/dateUtils.js";

export class BorrowingService {
  constructor({ books, members, loanPolicy, eventBus, clock = () => new Date() }) {
    if (!books || !members || !loanPolicy || !eventBus) {
      throw new Error("Books, members, loanPolicy, and eventBus dependencies are required");
    }

    this.books = books;
    this.members = members;
    this.loanPolicy = loanPolicy;
    this.eventBus = eventBus;
    this.clock = clock;
  }

  borrowBook(bookId, memberId) {
    const book = this.#getRequired(this.books, bookId, "Book");
    const member = this.#getRequired(this.members, memberId, "Member");

    if (!book.isAvailable) {
      throw new Error(`Book "${bookId}" is already borrowed`);
    }
    if (!this.loanPolicy.canBorrow(member, book)) {
      throw new Error(`Member "${memberId}" has reached the borrowing limit`);
    }

    const dueDate = addDays(this.clock(), this.loanPolicy.getLoanPeriodDays(member, book));
    book.borrow(member.id, dueDate);
    member.addBorrowedBook(book.id);
    this.books.save(book);
    this.members.save(member);

    const transaction = { bookId: book.id, memberId: member.id, dueDate };
    this.eventBus.publish("book:borrowed", transaction);
    return transaction;
  }

  returnBook(bookId, memberId) {
    const book = this.#getRequired(this.books, bookId, "Book");
    const member = this.#getRequired(this.members, memberId, "Member");

    if (book.borrowedBy !== member.id) {
      throw new Error(`Book "${bookId}" is not borrowed by member "${memberId}"`);
    }

    book.return();
    member.removeBorrowedBook(book.id);
    this.books.save(book);
    this.members.save(member);

    const transaction = { bookId: book.id, memberId: member.id };
    this.eventBus.publish("book:returned", transaction);
    return transaction;
  }

  #getRequired(repository, id, entityName) {
    const entity = repository.getById(id);
    if (!entity) {
      throw new Error(`${entityName} "${id}" was not found`);
    }
    return entity;
  }
}
