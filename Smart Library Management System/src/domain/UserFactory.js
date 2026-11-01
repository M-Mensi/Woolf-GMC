import { Student, Teacher } from "./User.js";

export class UserFactory {
  static createUser(type, details) {
    switch (type) {
      case "student":
        return new Student(details);
      case "teacher":
        return new Teacher(details);
      default:
        throw new RangeError(`Unsupported user type: ${type}`);
    }
  }
}
