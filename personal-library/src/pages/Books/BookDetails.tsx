import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3001/api/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Book not found');
        return res.json();
      })
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/books" className="back-link">← Back to books</Link>
        <h1 className="page-title">Book Details</h1>
      </header>
      <main className="page-content">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && !error && book && (
          <div className="book-details">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Published Year:</strong> {book.published_year}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Page Count:</strong> {book.page_count}</p>
            <p><strong>Status:</strong> {book.read ? 'Read' : 'Not read yet'}</p>
          </div>
        )}
        {!loading && !error && !book && (
          <p className="empty-state">Book not found.</p>
        )}
      </main>
    </div>
  );
}

export default BookDetails;