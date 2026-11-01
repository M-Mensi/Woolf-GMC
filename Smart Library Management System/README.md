# Library Management System

## 1. Project Overview

This project is a simple Library Management System developed using React and JavaScript.

The main goal is to manage library users, books, and borrowing operations while applying Object-Oriented Design (OOD) principles.

The application allows users to be added, books to be managed, and borrowing and returning operations to be performed.

## 2. Project Subsystems

The application is divided into three main subsystems:

### User Management

Handles the creation and management of library users.

- Student
- Teacher

### Book Management

Handles the library's books and their availability.

- Add new books.
- View available books.
- Track whether a book is borrowed or available.

### Borrowing System

Handles all borrowing operations.

- Borrow a book.
- Return a book.
- View borrowed books.
- Track overdue books and notify users.

## 3. Main Classes

The project uses the following classes:

| Class             | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| User              | Abstract class containing common user information and behavior. |
| Student           | Represents a student and inherits from User.                    |
| Teacher           | Represents a teacher and inherits from User.                    |
| Book              | Represents a book and stores its information and availability.  |
| LibrarySystem     | Manages users, books, and borrowing transactions.               |
| BorrowTransaction | Stores information about each borrowing operation.              |

## 4. Design Patterns

Two main design patterns are used in this project.

### Factory Pattern

The Factory Pattern is used to create different types of users.

The `UserFactory` class handles the creation of Student and Teacher objects. This avoids repeating object creation logic throughout the application and makes it easier to add other user types in the future.

### Singleton Pattern

The Singleton Pattern is used in the `LibrarySystem` class.

It ensures that only one instance of the library system exists. This instance is responsible for managing all users, books, and borrowing transactions.

### Observer Pattern (Optional)

The Observer Pattern can be used for overdue notifications.

Users can subscribe to notifications, and the notification service informs them when an overdue event occurs.

## 5. Object-Oriented Design Principles

The project applies the following OOD concepts:

- **Encapsulation:** Keeps object data protected and manages access through methods.
- **Inheritance:** Student and Teacher inherit common properties from User.
- **Abstraction:** User defines shared behavior for all types of users.
- **Polymorphism:** Different user types can implement shared methods in their own way.
- **Modularity:** The application is organized into separate classes and React components.

## 6. Main Features

The application includes the following functionalities:

- Add students and teachers.
- Add books to the library.
- Borrow available books.
- Return borrowed books.
- View borrowed books.
- Simulate overdue books using a flag and notify users.

## 7. Technologies Used

- **React** - Building the user interface.
- **JavaScript (ES6+)** - Application logic and object-oriented programming.
- **CSS** - Styling the application.

## 8. How to Run the Project

To run the application locally:

1. Clone or download the project.
2. Open the project folder in VS Code.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal.

## 9. Conclusion

This project was developed as part of an Object-Oriented Design assignment.

It helped me understand how to organize an application using classes, inheritance, encapsulation, and design patterns.

The Factory and Singleton patterns are used to make user creation and library management more organized. The system also provides the basic functionalities needed to manage a small library.

The project can be extended in the future with additional features, but the current version focuses on the main requirements of the assignment.
