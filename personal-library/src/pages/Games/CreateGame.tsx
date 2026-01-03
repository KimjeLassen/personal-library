import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface GameForm {
	title: string;
	platform: number;
	release_year: number;
	genre: string;
	order_index: number;
	finished: boolean;
}
interface GamePlatform {
    platform_id: number;
    name: string;
}
interface GameTag {
    tag_id: number;
    name: string;
}

const defaultForm: GameForm = {
	title: '',
	platform: 0,
	release_year: new Date().getFullYear(),
	genre: '',
	order_index: 0,
	finished: false,
};

function CreateGame() {
  const { id } = useParams<{ id?: string }>();
  const [form, setForm] = useState<GameForm>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [platforms, setPlatforms] = useState<GamePlatform[]>([]);
  const [tags, setTags] = useState<GameTag[]>([]);
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`http://localhost:3001/api/gametags`)
      .then((res) => {
        if (!res.ok) throw new Error("Fejl i tags");
        return res.json();
      })
      .then((data) => {
        setTags(data);
        setLoading(false);
      });
    fetch(`http://localhost:3001/api/gameplatforms`)
      .then((res) => {
        if (!res.ok) throw new Error("Fejl i platforme");
        return res.json();
      })
      .then((data) => {
        setPlatforms(data);
        setLoading(false);
      });

    if (id) {
      setLoading(true);
      fetch(`http://localhost:3001/api/games/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Game not found");
          return res.json();
        })
        .then((data) => {
          setForm({
            title: data.title,
            platform: data.platform,
            release_year: data.release_year,
            genre: data.genre,
            order_index: data.order_index,
            finished: data.finished,
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const isNumberField =
      name === "platform" ||
      name === "release_year" ||
      name === "order_index";

    setForm((prev) => ({
      ...prev,
      [name]:
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : isNumberField
          ? Number(value)
          : value,
    }));
  };

  const handleAddText = () => {
    if (inputTag.trim() !== "" && !addedTags.includes(inputTag)) {
      setAddedTags([...addedTags, inputTag]);
      setInputTag("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    console.log(JSON.stringify({ game: form, tags: addedTags }))
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:3001/api/games/${id}`
      : "http://localhost:3001/api/games";
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ game: form, tags: addedTags }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save game");
        return res.json();
      })
      .then(() => {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => navigate("/games"), 1000);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };
  const handleRemoveTag = (e: React.MouseEvent<HTMLButtonElement>) => {
      const tag = e.currentTarget.name.replace("remove_", "");
      setAddedTags(t => t.filter(item => item != tag))
  }


  return (
    <div className="page-container">
      <header className="page-header">
        <Link to="/games" className="back-link">
          ← Back to games
        </Link>
        <h1 className="page-title">{id ? "Update Game" : "Add a New Game"}</h1>
      </header>
      <main className="page-content">
        {loading && <p>Loading...</p>}
        {error && <p className="error">Error: {error}</p>}
        {success && <p className="success">Game saved!</p>}
        <form onSubmit={handleSubmit} className="game-form">
          <label>
            Title:
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Platform:
            <select
              name="platform" 
              value={form.platform} 
              onChange={handleChange} 
              required
            >
              <option value="">Vælg platform</option>
              {platforms.map((platforms) => (
                <option
                  key={platforms.platform_id}
                  value={platforms.platform_id}
                >
                  {platforms.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Release Year:
            <input
              name="release_year"
              type="number"
              value={form.release_year}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Genre:
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Finished:
            <input
              name="finished"
              type="checkbox"
              checked={form.finished}
              onChange={handleChange}
            />
          </label>
          <label>
            Tags:
            <input
              name="tags"
              list="suggestions"
              onChange={(e) => setInputTag(e.target.value)}
              required
            />
            <datalist id="suggestions">
              {tags.map((tags) => (
                <option key={tags.name} value={tags.name}>
                  {tags.name}
                </option>
              ))}
            </datalist>
          </label>
          <p>Tags here:</p>
          {addedTags.map((tag, index) => (
            <div key={index}>* {tag} <button name = {"remove_"+tag} onClick= {handleRemoveTag}type = "button" className = "btn btn-danger">Fjern</button></div>
          ))}
          <button type="button" onClick={handleAddText}>
            Tilføj tag
          </button>
          <button type="submit" disabled={loading}>
            {id ? "Update Game" : "Add Game"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateGame;
