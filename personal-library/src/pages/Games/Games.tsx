import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './Games.module.css';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface Game {
  game_id: number;
  title: string;
  release_year: number;
  genre: string;
  order_index: number;
  finished: boolean;
  tags: string[];
}

interface SortableGameCardProps {
  game: Game;
  columnValue: number
}

function GameCard({ game, columnValue }: SortableGameCardProps) {
  return (
    <div className={styles.grid_card} style={{ gridColumn: columnValue }}>
      <Link
        className={
          `${styles.blue_border} ${styles.blue_text} ${styles.game_card}` +
          " card"
        }
        to={`/games/${game.game_id}`}
      >
        <h5 className={`${styles.blue_border}` + " card-header"}>
          {game.title}
        </h5>
        <div className={`${styles.game_card_body}` + " card-body"}>
          <div className={styles.tagSection}>
            {game.tags.map((tag) => (
              <span
                key={tag}
                className={`${styles.gold_color} ${styles.tag}`}
                title={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.bottom}>
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
          </div>
        </div>
      </Link>
    </div>
  );
}

function SortableGameCard({ game }: SortableGameCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: game.game_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.grid_card}
      {...attributes}
      {...listeners}
    >
      <div
        className={
          `${styles.blue_border} ${styles.blue_text} ${styles.game_card}` +
          " card"
        }
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/games/${game.game_id}`;
        }}
      >
        <h5 className={`${styles.blue_border}` + " card-header"}>
          {game.title}
        </h5>
        <div className={`${styles.game_card_body}` + " card-body"}>
          <div className={styles.tagSection}>
            {game.tags.map((tag) => (
              <span
                key={tag}
                className={`${styles.gold_color} ${styles.tag}`}
                title={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={styles.bottom}>
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
          </div>
        </div>
      </div>
    </div>
  );
}

function Games() {
  const [platName, setPlatName] = useState("");
  const [platAdd, setPlatAdd] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOrder, setIsEditOrder] = useState(false);
  const [newOrderedGames, setNewOrderedGames] = useState<Game[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    fetch("http://localhost:3001/api/games")
      .then((res) => {
        if (!res.ok) throw new Error("Network error: " + res);
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setGames((items) => {
        const oldIndex = items.findIndex((item) => item.game_id === active.id);
        const newIndex = items.findIndex((item) => item.game_id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        const updatedGames = newOrder.map((game, index) => ({
          ...game,
          order_index: index,
        }));

        setNewOrderedGames(updatedGames)
        return updatedGames;
      });
    }
  };

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
    if (platName === '')
      return;
    const url = "http://localhost:3001/api/gameplatforms/";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: platName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save platform: " + res);
        return res.json();
      })
      .then(() => {
        setPlatAdd(false);
        setPlatName("");
      });
  };
  const handleEditOrderClick = () => {
    setIsEditOrder(true);
  };
  const handleSaveOrderClick = () => {
    const url = "http://localhost:3001/api/games/order"
    const method = "PUT"
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body:  JSON.stringify(newOrderedGames),
    })
    setIsEditOrder(false);
  }
  return (
    <div className={styles.gamingContainer}>
      <div className="container py-5">
        <header className={styles.pageHeader}>
          <Link to="/" className={styles.backLink}>
            ← Tilbage
          </Link>
          <h1 className={styles.pageTitle}>Spil</h1>
          <p className={styles.pageSubtitle}>Din spil-liste. Her kan du oprette spil og se de detaljer du har givet om spillet.</p>
          <div className={styles.buttonContainer}>
            {/* First button */}
            <div className={styles.firstButton}>
              <button
                disabled={loading || isEditOrder}  
                onClick={() => window.location.href = '/games/create'}
                className={`btn ${styles.btnPrimary} ${styles.btn}`}
              >
                + Tilføj nyt spil
              </button>
            </div>

            {/* Second button */}
            <div className={styles.secondButton}>
              {!platAdd && (
                <button
                  disabled={loading || isEditOrder}  
                  onClick={toggleAddForm}
                  className={`btn ${styles.btnSecondary} ${styles.btn}`}
                >
                  Opret platform
                </button>
              )}
              {platAdd && (
                <button
                  onClick={handleClose}
                  className={`btn ${styles.btnSecondary} ${styles.btn}`}
                >
                  Annuller
                </button>
              )}
            </div>

            {/* Third button */}
            <div className = {styles.thirdButton}>
            {!isEditOrder && ( 
              <button
                className={`btn ${styles.btnPrimary} ${styles.btn}`}
                onClick={handleEditOrderClick}
              >
                Omarranger
              </button>
            )}
            {isEditOrder && (
              <button
                className={`btn ${styles.btnPrimary} ${styles.btn}`}
                onClick={handleSaveOrderClick}
              >
                Gem
              </button>
            )}
            </div>
          </div>

          {/* Add platform panel */}
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
          {loading && <p>Indlæser...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && games.length === 0 && (
            <p className="empty-state">
              Tom liste. Tilføj nogle spil! 
            </p>
          )}
          {!loading && !error && games.length > 0 && isEditOrder && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={games.map((g) => g.game_id)}
                strategy={rectSortingStrategy}
              >
                <div className={styles.grid}>
                  {games.map((game, index) => {
                    const columnValue = (index % 3) + 1;
                    return (
                      <SortableGameCard
                        key={game.game_id}
                        game={game}
                        columnValue={columnValue}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
          {!loading && !error && games.length > 0 && !isEditOrder && (
            <div className={styles.grid}>
              {games.map((game, index) => {
                const columnValue = (index % 3) + 1;
                return (
                  <GameCard
                    key={game.game_id}
                    game={game}
                    columnValue={columnValue}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Games;
