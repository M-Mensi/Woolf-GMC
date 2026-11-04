import test from "node:test";
import assert from "node:assert/strict";
import {
  BorrowingService,
  EventBus,
  InMemoryRepository,
  LibraryFactory,
  StandardLoanPolicy,
  StudentLoanPolicy,
} from "../src/index.js";

function createSystem({ policy = new StandardLoanPolicy(), now = new Date("2026-01-01T00:00:00Z") } = {}) {
  const book = LibraryFactory.createBook({ id: "book-1", title: "Dune", author: "Frank Herbert" });
  const member = LibraryFactory.createMember({ id: "member-1", name: "Alex", borrowLimit: 1 });
  const books = new InMemoryRepository([book]);
  const members = new InMemoryRepository([member]);
  const eventBus = new EventBus();
  const service = new BorrowingService({
    books,
    members,
    loanPolicy: policy,
    eventBus,
    clock: () => new Date(now),
  });

  return { book, member, eventBus, service };
}

test("borrowing follows the injected policy and notifies observers", () => {
  const { book, member, eventBus, service } = createSystem({ policy: new StudentLoanPolicy() });
  let event;
  eventBus.subscribe("book:borrowed", (payload) => {
    event = payload;
  });

  const transaction = service.borrowBook(book.id, member.id);

  assert.equal(book.isAvailable, false);
  assert.deepEqual(member.borrowedBookIds, [book.id]);
  assert.equal(transaction.dueDate.toISOString(), "2026-01-22T00:00:00.000Z");
  assert.equal(event, transaction);
});

test("a member cannot exceed their borrowing limit", () => {
  const { book, member, service } = createSystem();
  member.addBorrowedBook("another-book");

  assert.throws(() => service.borrowBook(book.id, member.id), /reached the borrowing limit/);
  assert.equal(book.isAvailable, true);
});

test("returning a book restores availability and emits an event", () => {
  const { book, member, eventBus, service } = createSystem();
  let returned;
  eventBus.subscribe("book:returned", (payload) => {
    returned = payload;
  });
  service.borrowBook(book.id, member.id);

  service.returnBook(book.id, member.id);

  assert.equal(book.isAvailable, true);
  assert.deepEqual(member.borrowedBookIds, []);
  assert.deepEqual(returned, { bookId: book.id, memberId: member.id });
});
