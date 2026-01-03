import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="page-container">
      <header className="page-header">
        <Link to="/" className="back-link">
          ← Back to Library
        </Link>
        <h1 className="page-title">Games</h1>
        <p className="page-subtitle">Your gaming library</p>
      </header>

      <main className="page-content">
        <div id="button-container">
          <a className="btn btn-primary create-button" href="/games/create">
            + Add New Game
          </a>
          <button
            onClick={toggleAddForm}
            className="btn btn-secondary create-button"
          >
            Opret platform
          </button>
          {platAdd && (
            <div id="platform-add-container">
              <h3>Add Game Platform</h3>
              <label htmlFor="nameInput">Name: </label>
              <input
                id="nameInput"
                type="text"
                value={platName}
                onChange={handleOnChange}
              />
              <button
                className="btn btn-primary"
                onClick={handlePlatformAddClick}
              >
                Tilføj
              </button>
            </div>
          )}
        </div>
        <p className="empty-state">
          No games added yet. Start building your collection!
        </p>
      </main>
    </div>
  );
}

export default Games;
