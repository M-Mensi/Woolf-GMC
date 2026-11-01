# Little Library — Lending Desk

A simple React and JavaScript library manager. It demonstrates class inheritance, encapsulation, an abstract `User` base class, a `UserFactory`, and a singleton `LibrarySystem`.

## Run locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open the local address printed by Vite. Create a production build with `npm run build`, or run the domain tests with `npm test`.

## Features

- Add student and teacher members.
- Add books and see which titles are available.
- Check out a book to a member and return it.
- View current loans and simulate or clear an overdue notice.

Data is held in the singleton library instance for the lifetime of the app; reloading the page resets it to the starter collection.
