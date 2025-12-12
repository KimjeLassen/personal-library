import React from 'react';
import { Link } from 'react-router-dom';

function BookDetails() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/books" className="back-link">← Back to books</Link>
        <h1 className="page-title">Book Details (Placeholder)</h1>
      </header>
      
      <main className="page-content">
        <p className="empty-state">No books added yet. Start building your collection!</p>
      </main>
    </div>
  );
}

export default BookDetails;