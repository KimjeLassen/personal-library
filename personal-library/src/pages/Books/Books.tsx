import React from 'react';
import { Link } from 'react-router-dom';

function Books() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Library</Link>
        <h1 className="page-title">Books</h1>
        <p className="page-subtitle">Your reading collection</p>
      </header>
      
      <main className="page-content">
        <p className="empty-state">No books added yet. Start building your collection!</p>
      </main>
    </div>
  );
}

export default Books;
