export class Book {
  #id;
  #title;
  #author;
  #color;
  #available = true;

  constructor({ id, title, author, color = "green" }) {
    this.#id = id;
    this.#title = title.trim();
    this.#author = author.trim();
    this.#color = color;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get author() {
    return this.#author;
  }

  get color() {
    return this.#color;
  }

  get available() {
    return this.#available;
  }

  borrow() {
    if (!this.#available) {
      throw new Error(`"${this.#title}" is already borrowed.`);
    }
    this.#available = false;
  }

  returnToLibrary() {
    if (this.#available) {
      throw new Error(`"${this.#title}" is already in the library.`);
    }
    this.#available = true;
  }
}
