# Library Management System - Core Components (JS)

A small Node.js library core using ES modules and no external dependencies.

## Components

- `LibraryFactory` creates books and members.
- `BorrowingService` handles borrowing and returns using injected repositories, a loan policy, an event bus, and a clock.
- `StandardLoanPolicy` and `StudentLoanPolicy` demonstrate the Strategy pattern.
- `EventBus` lets observers subscribe to `book:borrowed` and `book:returned`.
- `InMemoryRepository` is a replaceable repository implementation. Dependencies can be substituted in tests or applications.
- `LoanPolicy` is an interface-like base class; custom policies implement `canBorrow(member)` and `getLoanPeriodDays(member)`.

## Run tests

```bash
npm test
```

## Example

```js
import {
  BorrowingService,
  EventBus,
  InMemoryRepository,
  LibraryFactory,
  StandardLoanPolicy,
} from "./src/index.js";

const books = new InMemoryRepository([
  LibraryFactory.createBook({ id: "b1", title: "Dune", author: "Frank Herbert" }),
]);
const members = new InMemoryRepository([
  LibraryFactory.createMember({ id: "m1", name: "Alex" }),
]);
const eventBus = new EventBus();
eventBus.subscribe("book:borrowed", ({ bookId, memberId, dueDate }) => {
  console.log(`${memberId} borrowed ${bookId} until ${dueDate.toDateString()}`);
});

const borrowingService = new BorrowingService({
  books,
  members,
  loanPolicy: new StandardLoanPolicy(),
  eventBus,
});
borrowingService.borrowBook("b1", "m1");
```
