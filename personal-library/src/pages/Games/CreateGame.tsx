import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './Games.module.css';

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
    <div className={styles.gamingContainer}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            
            <header className="mb-4">
              <Link to="/games" className={styles.backLink}>
                ← Back to games
              </Link>
              <h1 className={`${styles.pageTitle} mt-2`}>
                {id ? "Update Game" : "Add a New Game"}
              </h1>
            </header>

            <main className={styles.gamingCard}>
              {loading && <p className={`${styles.blink} text-info`}>Loading...</p>}
              {error && <p className="text-danger">Error: {error}</p>}
              {success && <p className="text-success">Game saved!</p>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{color: '#2aa198'}}>Title:</label>
                  <input
                    name="title"
                    className={`form-control ${styles.gamingInput}`}
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{color: '#2aa198'}}>Platform:</label>
                    <select
                      name="platform"
                      className={`form-select ${styles.gamingInput}`}
                      value={form.platform}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Vælg platform</option>
                      {platforms.map((p) => (
                        <option key={p.platform_id} value={p.platform_id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label" style={{color: '#2aa198'}}>Release Year:</label>
                    <input
                      name="release_year"
                      type="number"
                      className={`form-control ${styles.gamingInput}`}
                      value={form.release_year}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{color: '#2aa198'}}>Genre:</label>
                  <input
                    name="genre"
                    className={`form-control ${styles.gamingInput}`}
                    value={form.genre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-check mb-4">
                  <input
                    name="finished"
                    type="checkbox"
                    className="form-check-input"
                    checked={form.finished}
                    onChange={handleChange}
                  />
                  <label className="form-check-label text-light">Finished</label>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{color: '#2aa198'}}>Tags:</label>
                  <div className="input-group">
                    <input
                      className={`form-control ${styles.gamingInput}`}
                      list="suggestions"
                      value={inputTag}
                      onChange={(e) => setInputTag(e.target.value)}
                    />
                    <button className="btn btn-outline-info" type="button" onClick={handleAddText} style={{borderColor: '#2aa198', color: '#2aa198'}}>
                      Tilføj tag
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="small" style={{color: '#2aa198'}}>Tags here:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {addedTags.map((tag, index) => (
                      <div key={index} className={styles.tagBadge}>
                        * {tag} 
                        <button 
                          name={"remove_" + tag} 
                          onClick={handleRemoveTag} 
                          type="button" 
                          className={styles.btnRemove}
                        >
                          Fjern
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className={`${styles.btnGamingSubmit} w-100`} disabled={loading}>
                  {id ? "Update Game" : "Add Game"}
                </button>
              </form>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGame;
