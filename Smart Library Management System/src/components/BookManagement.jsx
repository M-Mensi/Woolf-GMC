import { useState } from "react";

export default function BookManagement({ books, onAddBook, onBorrowBook, users }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [memberId, setMemberId] = useState("");
  const [bookId, setBookId] = useState("");
  const availableBooks = books.filter((book) => book.available);

  function handleAddBook(event) {
    event.preventDefault();
    onAddBook({ title, author });
    setTitle("");
    setAuthor("");
  }

  function handleBorrowBook(event) {
    event.preventDefault();
    onBorrowBook(memberId, bookId);
  }

  return (
    <section className="panel" aria-labelledby="book-management-title">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">THE COLLECTION</span>
          <h2 id="book-management-title">Books</h2>
        </div>
        <span className="count-pill">{books.length} titles</span>
      </div>

      <form className="inline-form book-form" onSubmit={handleAddBook}>
        <label className="visually-hidden" htmlFor="book-title">Book title</label>
        <input
          id="book-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Book title"
          required
        />
        <label className="visually-hidden" htmlFor="book-author">Author</label>
        <input
          id="book-author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          placeholder="Author"
          required
        />
        <button className="button button-dark" type="submit">Add book <span aria-hidden="true">+</span></button>
      </form>

      <form className="borrow-form" onSubmit={handleBorrowBook}>
        <div className="borrow-form-title">
          <span className="borrow-icon" aria-hidden="true">↗</span>
          <div>
            <strong>Check out a book</strong>
            <span>Choose a member and an available title.</span>
          </div>
        </div>
        <div className="borrow-form-fields">
          <label>
            <span className="visually-hidden">Member</span>
            <select
              value={memberId}
              onChange={(event) => setMemberId(event.target.value)}
              required
            >
              <option value="">Choose a member</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} · {user.role}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="visually-hidden">Available book</span>
            <select
              value={bookId}
              onChange={(event) => setBookId(event.target.value)}
              required
            >
              <option value="">Choose an available book</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>
          <button className="button button-lime" type="submit" disabled={!users.length || !availableBooks.length}>
            Borrow book
          </button>
        </div>
      </form>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">BOOK</th>
              <th scope="col">AUTHOR</th>
              <th scope="col">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>
                  <span className="book-cell">
                    <span className={`book-cover ${book.color}`} aria-hidden="true">✳</span>
                    <strong>{book.title}</strong>
                  </span>
                </td>
                <td>{book.author}</td>
                <td>
                  <span className={`status-pill ${book.available ? "available" : "checked-out"}`}>
                    <span aria-hidden="true" />
                    {book.available ? "Available" : "Checked out"}
                  </span>
                </td>
              </tr>
            ))}
            {books.length === 0 && (
              <tr><td className="empty-cell" colSpan="3">Your collection is ready for its first book.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
