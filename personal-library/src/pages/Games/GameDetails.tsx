import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./Games.module.css";

interface Game {
  game_id: number;
  title: string;
  release_year: number;
  genre: string;
  order_index: number;
  finished: boolean;
  tags: string[];
}

function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3001/api/games/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Game not found");
        return res.json();
      })
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className={styles.gamingContainer}>
      <div className="container py-5">
        <header className={styles.pageHeader}>
          <Link to="/games" className={styles.backLink}>
            ← Back to Games
          </Link>
          <h1 className={styles.pageTitle}>Spildetaljer</h1>
          <div className={styles.buttonContainer}>
            <div className={styles.onlyButton}>
              <a
                className={`btn ${styles.btnPrimary}`}
                href={`/games/edit/${game?.game_id}`}
              >
                + Rediger spil
              </a>
            </div>
          </div>
        </header>
        <main className="page-content">
          {loading && <p>Loading...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && game && (
            <div className={styles.gamingCard}>
              <h2 className={styles.detailsTitle}>{game.title}</h2>
              <div className={styles.detailsContent}>
                <p className={styles.detailsRow}>
                  <strong className={styles.detailsLabel}>Udgivelsesår:</strong>{" "}
                  {game.release_year}
                </p>
                <p className={styles.detailsRow}>
                  <strong className={styles.detailsLabel}>Genre:</strong>{" "}
                  {game.genre}
                </p>
                <p className={styles.detailsRow}>
                  <strong className={styles.detailsLabel}>Status:</strong>{" "}
                  <span
                    className={
                      game.finished
                        ? styles.statusFinished
                        : styles.statusInProgress
                    }
                  >
                    {game.finished ? "Færdig" : "Ikke færdig"}
                  </span>
                </p>
                {game.tags && game.tags.length > 0 && (
                  <div className={styles.tagsSection}>
                    <strong className={styles.detailsLabel}>Tags:</strong>
                    <div className={styles.tagsContainer}>
                      {game.tags.map((tag) => (
                        <span key={tag} className={styles.tagSpan}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {!loading && !error && !game && (
            <p className="empty-state">Spil ikke fundet.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default GameDetails;
