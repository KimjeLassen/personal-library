import React from 'react';
import { Link } from 'react-router-dom';

function Games() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Library</Link>
        <h1 className="page-title">Games</h1>
        <p className="page-subtitle">Your gaming library</p>
      </header>
      
      <main className="page-content">
        <p className="empty-state">No games added yet. Start building your collection!</p>
      </main>
    </div>
  );
}

export default Games;
