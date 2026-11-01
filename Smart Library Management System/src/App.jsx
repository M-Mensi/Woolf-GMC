import { useState } from "react";
import BookManagement from "./components/BookManagement.jsx";
import BorrowedBooks from "./components/BorrowedBooks.jsx";
import MemberManagement from "./components/MemberManagement.jsx";
import StatCard from "./components/StatCard.jsx";
import { LibrarySystem } from "./domain/LibrarySystem.js";

const library = LibrarySystem.getInstance();

const starterBooks = [
  { title: "The Creative Act", author: "Rick Rubin", color: "coral" },
  { title: "Braiding Sweetgrass", author: "Robin Wall Kimmerer", color: "green" },
  { title: "The Midnight Library", author: "Matt Haig", color: "lavender" },
];

export default function App() {
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState(null);
  const users = library.users;
  const books = library.books;
  const transactions = library.transactions;
  const borrowedCount = transactions.filter((transaction) => !transaction.returnedAt).length;
  const overdueCount = transactions.filter(
    (transaction) => !transaction.returnedAt && transaction.isOverdue,
  ).length;

  function updateLibrary(action, successMessage) {
    try {
      action();
      setRevision((current) => current + 1);
      setNotice({ message: successMessage, type: "success" });
    } catch (error) {
      setNotice({ message: error.message, type: "error" });
    }
  }

  function handleAddBook(details) {
    updateLibrary(
      () => library.addBook({ id: crypto.randomUUID(), ...details, color: "green" }),
      `"${details.title.trim()}" was added to the collection.`,
    );
  }

  function handleAddUser(type, details) {
    updateLibrary(
      () => library.addUser(type, { id: crypto.randomUUID(), ...details }),
      `${details.name.trim()} was added as a ${type}.`,
    );
  }

  function handleBorrowBook(userId, bookId) {
    const book = books.find((item) => item.id === bookId);
    updateLibrary(
      () => library.borrowBook(userId, bookId),
      `"${book?.title ?? "Book"}" was checked out.`,
    );
  }

  function handleReturnBook(transactionId) {
    const transaction = transactions.find((item) => item.id === transactionId);
    updateLibrary(
      () => library.returnBook(transactionId),
      `"${transaction?.book.title ?? "Book"}" was returned.`,
    );
  }

  function handleToggleOverdue(transactionId) {
    const transaction = transactions.find((item) => item.id === transactionId);
    if (!transaction) {
      setNotice({ message: "This borrowed book could not be found.", type: "error" });
      return;
    }
    updateLibrary(
      () => transaction.markOverdue(!transaction.isOverdue),
      transaction.isOverdue
        ? `The overdue notice for ${transaction.user.name} was cleared.`
        : `Overdue notice sent to ${transaction.user.name} for "${transaction.book.title}".`,
    );
  }

  return (
    <div className="app-shell" data-revision={revision}>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Little Library home">
          <span className="brand-icon" aria-hidden="true">L</span>
          <span>little<span>library</span></span>
        </a>
        <div className="topbar-right">
          <span className="open-indicator"><span /> LIBRARY OPEN</span>
          <span className="topbar-divider" aria-hidden="true" />
          <span className="desk-label">LENDING DESK</span>
        </div>
      </header>

      <main id="home" className="main-content">
        <section className="welcome-row">
          <div>
            <p className="eyebrow"><span>YOUR LOCAL LIBRARY</span><span className="eyebrow-star">✳</span> A LITTLE PLACE FOR BIG IDEAS</p>
            <h1>A good book finds<br />its <span>next chapter.</span></h1>
            <p className="welcome-copy">
              Keep your shelves in order and your stories moving from one reader to the next.
            </p>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <span className="sun-shape" />
            <span className="plant plant-one">✳</span>
            <span className="plant plant-two">✦</span>
            <div className="book-stack">
              <span className="stack-book stack-book-back" />
              <span className="stack-book stack-book-middle" />
              <span className="stack-book stack-book-front"><i /></span>
            </div>
            <span className="art-sparkle">✳</span>
          </div>
        </section>

        <section className="stats-grid" aria-label="Library overview">
          <StatCard label="BOOKS ON THE SHELF" value={books.length} icon="▤" tone="stat-green" />
          <StatCard label="LIBRARY MEMBERS" value={users.length} icon="♧" tone="stat-lilac" />
          <StatCard label="BOOKS CHECKED OUT" value={borrowedCount} icon="↗" tone="stat-peach" />
          <StatCard label="OVERDUE NOTICES" value={overdueCount} icon="◷" tone="stat-yellow" />
        </section>

        {notice && (
          <div className={`notice-banner ${notice.type}`} role="status" key={notice.message}>
            <span aria-hidden="true">{notice.type === "success" ? "✓" : "!"}</span>
            {notice.message}
            <button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button>
          </div>
        )}

        <div className="workspace-grid">
          <div className="primary-column">
            <BookManagement
              books={books}
              onAddBook={handleAddBook}
              onBorrowBook={handleBorrowBook}
              users={users}
            />
            <BorrowedBooks
              onReturnBook={handleReturnBook}
              onToggleOverdue={handleToggleOverdue}
              transactions={transactions}
            />
          </div>
          <MemberManagement users={users} onAddUser={handleAddUser} />
        </div>

        <footer className="page-footer">
          <span>MADE FOR READERS, WITH A LITTLE CARE <span aria-hidden="true">✳</span></span>
          <span>ONE GOOD BOOK AT A TIME</span>
        </footer>
      </main>
    </div>
  );
}

for (const book of starterBooks) {
  library.addBook({ id: crypto.randomUUID(), ...book });
}
