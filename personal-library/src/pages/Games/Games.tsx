import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './Games.module.css';

interface Game {
  game_id: number;
  title: string;
  release_year: number;
  genre: string;
  order_index: number;
  finished: boolean;
  tags: string[];
}

function Games() {
  const [platName, setPlatName] = useState("");
  const [platAdd, setPlatAdd] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/games")
      .then((res) => {
        if (!res.ok) throw new Error("Fejl i netværk");
        return res.json();
      })
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setPlatAdd(false);
      setIsClosing(false);
    }, 300);
  };

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
          <div className={styles.buttonContainer}>
            <div className={styles.firstButton}>
              <a className={`btn ${styles.btnPrimary}`} href="/games/create">
                + Add New Game
              </a>
            </div>
            <div className={styles.secondButton}>
              {!platAdd && (
                <button
                  onClick={toggleAddForm}
                  className={`btn ${styles.btnSecondary}`}
                >
                  Opret platform
                </button>
              )}
              {platAdd && (
                <button
                  onClick={handleClose}
                  className={`btn ${styles.btnSecondary}`}
                >
                  Annuller
                </button>
              )}
            </div>
          </div>
          {platAdd && (
            <div
              className={`${styles.platformAddCard} ${
                isClosing ? styles.slideUpOut : ""
              }`}
            >
              <div className="gap-2">
                <label
                  htmlFor="nameInput"
                  style={{ color: "#2aa198", margin: "5px" }}
                >
                  Navn:{" "}
                </label>
                <input
                  id="nameInput"
                  className={styles.gamingInput}
                  type="text"
                  value={platName}
                  onChange={handleOnChange}
                />
              </div>
              <button
                className={`btn ${styles.btnPrimary}`}
                onClick={handlePlatformAddClick}
                style={{ margin: "10px" }}
              >
                Tilføj
              </button>
            </div>
          )}
        </header>

        <main className="page-content">
          {/* This part shows if list is empty */}
          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && games.length === 0 && (
            <p className="empty-state">
              No books added yet. Start building your collection!
            </p>
          )}
          {!loading && !error && games.length > 0 && (
            <div className= {styles.grid}>
              {games.map((game, index) => {
                const columnValue = (index % 3) + 1;
              return (
                <div key= {game.game_id} className={styles.grid_card} style={{gridColumn: columnValue}}>
                  <Link className={`${styles.blue_border} ${styles.blue_text} ${styles.game_card}` + " card"} to ={`/games/${game.game_id}`}>
                    <h5 className={`${styles.blue_border}` + " card-header"}>{game.title}</h5>
                    <div className={`${styles.game_card_body}` + " card-body"}>
                      {game.tags.map((tag) => (
                        <p key={tag} className={`${styles.tag}`}><span className= {`${styles.gold_color}`}>{tag}</span></p>
                      ))}
                      <h5 className="card-title">{game.genre}</h5>
                    </div>
                  </Link>
                </div>
              )})}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Games;
