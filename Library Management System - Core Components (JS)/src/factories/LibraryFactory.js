import { Book } from "../models/Book.js";
import { Member } from "../models/Member.js";

export class LibraryFactory {
  static createBook(details) {
    return new Book(details);
  }

  static createMember(details) {
    return new Member(details);
  }
}
