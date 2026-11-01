export default function BorrowedBooks({ onReturnBook, onToggleOverdue, transactions }) {
  const borrowed = transactions.filter((transaction) => !transaction.returnedAt);

  return (
    <section className="panel borrowed-panel" aria-labelledby="borrowed-books-title">
      <div className="panel-heading">
        <div>
          <span className="section-kicker">OUT IN THE WORLD</span>
          <h2 id="borrowed-books-title">Borrowed books</h2>
        </div>
        <span className="count-pill">{borrowed.length} out</span>
      </div>

      {borrowed.length > 0 ? (
        <div className="borrowed-list">
          {borrowed.map((transaction) => (
            <article
              className={`borrowed-row ${transaction.isOverdue ? "is-overdue" : ""}`}
              key={transaction.id}
            >
              <span className="borrowed-book-icon" aria-hidden="true">▤</span>
              <span className="borrowed-info">
                <strong>{transaction.book.title}</strong>
                <small>Borrowed by {transaction.user.name} · {transaction.user.role}</small>
                {transaction.isOverdue && (
                  <span className="overdue-notice" role="status">
                    Overdue notice sent to {transaction.user.name}.
                  </span>
                )}
              </span>
              <div className="borrowed-actions">
                <button
                  className={`overdue-toggle ${transaction.isOverdue ? "active" : ""}`}
                  type="button"
                  aria-pressed={transaction.isOverdue}
                  onClick={() => onToggleOverdue(transaction.id)}
                >
                  {transaction.isOverdue ? "Clear notice" : "Simulate overdue"}
                </button>
                <button
                  className="return-button"
                  type="button"
                  onClick={() => onReturnBook(transaction.id)}
                >
                  Return
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-borrowed">
          <span aria-hidden="true">✳</span>
          <p>No books are out right now.</p>
          <small>When a member borrows a book, it will show up here.</small>
        </div>
      )}
    </section>
  );
}
