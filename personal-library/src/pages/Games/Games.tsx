import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './Games.module.css';

function Games() {
  const [platName, setPlatName] = useState("");
  const [platAdd, setPlatAdd] = useState(false);

  const toggleAddForm = () => {
    setPlatAdd(!platAdd);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlatName(e.target.value);
  };

  const handlePlatformAddClick = () => {
    const url = "http://localhost:3001/api/gameplatforms/";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: platName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save platform");
        return res.json();
      })
      .then(() => {
        setPlatAdd(false);
        setPlatName("");
      });
  };
return (
    <div className={styles.gamingContainer}>
      <div className="container py-5">
        
        <header className={styles.pageHeader}>
          <Link to="/" className={styles.backLink}>
            ← Back to Library
          </Link>
          <h1 className={styles.pageTitle}>Games</h1>
          <p className={styles.pageSubtitle}>Your gaming library</p>
        </header>

        <main className="page-content">
          <div className={styles.buttonContainer}>
            <a className={`btn ${styles.btnPrimary}`} href="/games/create">
              + Add New Game
            </a>
            <button
              onClick={toggleAddForm}
              className={`btn ${styles.btnSecondary}`}
            >
              Opret platform
            </button>
          </div>

          {platAdd && (
            <div className={styles.platformAddCard}>
              <h3>Add Game Platform</h3>
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="nameInput" style={{color: '#2aa198'}}>Name: </label>
                <input
                  id="nameInput"
                  className={styles.gamingInput}
                  type="text"
                  value={platName}
                  onChange={handleOnChange}
                />
                <button
                  className={`btn ${styles.btnPrimary}`}
                  onClick={handlePlatformAddClick}
                >
                  Tilføj
                </button>
              </div>
            </div>
          )}

          {/* This part shows if list is empty */}
          <p className={styles.emptyState}>
            No games added yet. Start building your collection!
          </p>
        </main>
      </div>
    </div>
  );
}

export default Games;
