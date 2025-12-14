import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface BookForm {
	title: string;
	author: string;
	published_year: number;
	genre: string;
	book_category_id: number;
	page_count: number;
	read: boolean;
}

const defaultForm: BookForm = {
	title: '',
	author: '',
	published_year: new Date().getFullYear(),
	genre: '',
	book_category_id: 1,
	page_count: 0,
	read: false,
};

function CreateBook() {
	const { id } = useParams<{ id?: string }>();
	const [form, setForm] = useState<BookForm>(defaultForm);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	// Fetch book data if updating
	useEffect(() => {
		if (id) {
			setLoading(true);
			fetch(`http://localhost:3001/api/books/${id}`)
				.then((res) => {
					if (!res.ok) throw new Error('Book not found');
					return res.json();
				})
				.then((data) => {
					setForm({
						title: data.title,
						author: data.author,
						published_year: data.published_year,
						genre: data.genre,
						book_category_id: data.book_category_id,
						page_count: data.page_count,
						read: data.read,
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
				<Link to="/books" className="back-link">← Back to books</Link>
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
						Author:
						<input name="author" value={form.author} onChange={handleChange} required />
					</label>
					<label>
						Published Year:
						<input name="published_year" type="number" value={form.published_year} onChange={handleChange} required />
					</label>
					<label>
						Genre:
						<input name="genre" value={form.genre} onChange={handleChange} required />
					</label>
					<label>
						Category ID:
						<input name="book_category_id" type="number" value={form.book_category_id} onChange={handleChange} required />
					</label>
					<label>
						Page Count:
						<input name="page_count" type="number" value={form.page_count} onChange={handleChange} required />
					</label>
					<label>
						Read:
						<input name="read" type="checkbox" checked={form.read} onChange={handleChange} />
					</label>
					<button type="submit" disabled={loading}>{id ? 'Update Book' : 'Add Book'}</button>
				</form>
			</main>
		</div>
	);
}

export default CreateBook;
