import assert from "node:assert/strict";
import test from "node:test";
import { LibrarySystem } from "./LibrarySystem.js";
import { Student, Teacher, User } from "./User.js";
import { UserFactory } from "./UserFactory.js";

test("User is abstract and the factory creates student and teacher instances", () => {
  assert.throws(
    () => new User({ id: "1", name: "Alex", email: "alex@example.com" }),
    /abstract class/,
  );

  const student = UserFactory.createUser("student", {
    id: "student-1",
    name: " Alex Morgan ",
    email: " alex@example.com ",
  });
  const teacher = UserFactory.createUser("teacher", {
    id: "teacher-1",
    name: "Jamie Lee",
    email: "jamie@example.com",
  });

  assert.ok(student instanceof Student);
  assert.ok(student instanceof User);
  assert.equal(student.name, "Alex Morgan");
  assert.equal(student.role, "Student");
  assert.ok(teacher instanceof Teacher);
  assert.equal(teacher.role, "Teacher");
  assert.throws(() => UserFactory.createUser("librarian", {}), /Unsupported user type/);
});

test("LibrarySystem is a singleton that manages book borrowing and returns", () => {
  const library = LibrarySystem.getInstance();
  assert.equal(LibrarySystem.getInstance(), library);
  assert.throws(() => new LibrarySystem(), /getInstance/);

  const user = library.addUser("student", {
    id: "test-student",
    name: "Test Reader",
    email: "reader@example.com",
  });
  const book = library.addBook({
    id: "test-book",
    title: "A Test Book",
    author: "A. Writer",
  });
  const transaction = library.borrowBook(user.id, book.id);

  assert.equal(book.available, false);
  assert.equal(transaction.user, user);
  assert.equal(transaction.book, book);
  assert.throws(() => library.borrowBook(user.id, book.id), /already borrowed/);

  transaction.markOverdue(true);
  assert.equal(transaction.isOverdue, true);
  library.returnBook(transaction.id);
  assert.equal(transaction.returnedAt instanceof Date, true);
  assert.equal(transaction.isOverdue, false);
  assert.equal(book.available, true);
  assert.throws(() => library.returnBook(transaction.id), /could not be found/);
});

test("library collection getters do not expose mutable internal arrays", () => {
  const library = LibrarySystem.getInstance();
  const users = library.users;
  const books = library.books;
  const transactions = library.transactions;

  users.length = 0;
  books.length = 0;
  transactions.length = 0;

  assert.notEqual(library.users, users);
  assert.notEqual(library.books, books);
  assert.notEqual(library.transactions, transactions);
  assert.ok(library.users.length > 0);
  assert.ok(library.books.length > 0);
});
