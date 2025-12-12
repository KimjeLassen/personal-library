import React from 'react';
import { Link } from 'react-router-dom';

function Vinyls() {
  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-link">← Back to Library</Link>
        <h1 className="page-title">Vinyls</h1>
        <p className="page-subtitle">Your music collection</p>
      </header>
      
      <main className="page-content">
        <p className="empty-state">No vinyls added yet. Start building your collection!</p>
      </main>
    </div>
  );
}

export default Vinyls;
