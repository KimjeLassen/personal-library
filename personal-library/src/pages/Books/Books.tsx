
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function Books() {
  const [apiResult, setApiResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/test')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        setApiResult(JSON.stringify(data));
      })
      .catch((err) => {
        setError(err.message);
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
        {error && <p className="error">Error: {error}</p>}
        {apiResult && <p className="api-result">API Result: {apiResult}</p>}
        {!apiResult && !error && (
          <p className="empty-state">No books added yet. Start building your collection!</p>
        )}
      </main>
    </div>
  );
}

export default Books;
