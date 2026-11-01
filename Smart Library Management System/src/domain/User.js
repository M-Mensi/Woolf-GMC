export class User {
  #id;
  #name;
  #email;

  constructor({ id, name, email }) {
    if (new.target === User) {
      throw new TypeError("User is an abstract class and cannot be instantiated.");
    }

    this.#id = id;
    this.#name = name.trim();
    this.#email = email.trim();
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get email() {
    return this.#email;
  }

  get role() {
    throw new Error("Subclasses must define a role.");
  }
}

export class Student extends User {
  get role() {
    return "Student";
  }
}

export class Teacher extends User {
  get role() {
    return "Teacher";
  }
}
