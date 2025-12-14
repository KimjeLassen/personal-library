import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Book {
  book_id: number;
  title: string;
  author: string;
  published_year: number;
  genre: string;
  book_category_id: number;
  page_count: number;
  read: boolean;
}

function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/books')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Library</Link>
        <h1 className="page-title">Books</h1>
        <p className="page-subtitle">Your reading collection</p>
      </header>
      <main className="page-content">
        <button className="create-button">
        <a href="/books/create">+ Add New Book</a>
        </button>
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && books.length === 0 && (
          <p className="empty-state">No books added yet. Start building your collection!</p>
        )}
        {!loading && !error && books.length > 0 && (
          <ul className="book-list">
            {books.map((book) => (
              <li key={book.book_id} className="book-list-item">
                <Link to={`/books/${book.book_id}`}>{book.title} by {book.author}</Link>
                {book.read && <span className="read-badge">Read</span>}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

export default Books;
