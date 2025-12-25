import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface GameForm {
	title: string;
	platform: number;
	release_year: number;
	genre: string;
	order_index: number;
	finished: boolean;
    tags: string[];
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
    tags: []
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
    const [inputTag, setInputTag] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`http://localhost:3001/api/gametags`)
            .then((res) => {
                if (!res.ok) throw new Error('Fejl i tags');
                return res.json();
            })
            .then((data) => {
                setTags(data);
                setLoading(false);
            })
        fetch(`http://localhost:3001/api/gameplatforms`)
            .then((res) => {
                if (!res.ok) throw new Error('Fejl i platforme');
                return res.json();
            })
            .then((data) => {
                setPlatforms(data);
                setLoading(false);
            })

        if (id) {
            setLoading(true);
            fetch(`http://localhost:3001/api/games/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Book not found');
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
                        tags: data.tags
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
        }));
    };

    const handleAddText = () => {
    if (inputTag.trim() !== '' && !addedTags.includes(inputTag)) {
            const temp = addedTags;
            temp.push(inputTag);
            setAddedTags(temp);

            setInputTag('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        const method = id ? 'PUT' : 'POST';
        const url = id ? `http://localhost:3001/api/books/${id}` : 'http://localhost:3001/api/books';
        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to save book');
                return res.json();
            })
            .then(() => {
                setSuccess(true);
                setLoading(false);
                setTimeout(() => navigate('/books'), 1000);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <Link to="/games" className="back-link">← Back to games</Link>
                <h1 className="page-title">{id ? 'Update Book' : 'Add a New Book'}</h1>
            </header>
            <main className="page-content">
                {loading && <p>Loading...</p>}
                {error && <p className="error">Error: {error}</p>}
                {success && <p className="success">Book saved!</p>}
                <form onSubmit={handleSubmit} className="book-form">
                    <label>
                        Title:
                        <input name="title" value={form.title} onChange={handleChange} required />
                    </label>
                    <label>
                        Platform:
                        <select name="platform" required>
                            <option value="">Vælg platform</option>
                            {platforms.map((platforms) => (
                                <option key={platforms.name} value={platforms.platform_id}>{platforms.name}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Release Year:
                        <input name="release_year" type="number" value={form.release_year} onChange={handleChange} required />
                    </label>
                    <label>
                        Genre:
                        <input name="genre" value={form.genre} onChange={handleChange} required />
                    </label>
                    <label>
                        Finished:
                        <input name="finished" type="checkbox" checked={form.finished} onChange={handleChange} />
                    </label>
                    <label>
                        Tags:
                        <input name="tags" list="suggestions" onChange={(e) => setInputTag(e.target.value)} required />
                        <datalist id="suggestions">
                            {tags.map((tags) => (
                                <option key={tags.name} value={tags.name}>{tags.name}</option>
                            ))}
                        </datalist>
                    </label>
                    <p>Tags here:</p>
                    {addedTags.map((tag, index) => (
                        <div key={index}>- {tag}</div>
                    ))}
                    <button onClick={handleAddText}>Tilføj tag</button>
                    <button type="submit" disabled={loading}>{id ? 'Update Game' : 'Add Game'}</button>
                </form>
            </main>
        </div>
    );
}

export default CreateGame;
