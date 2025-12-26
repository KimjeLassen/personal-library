import React, { useEffect, useState } from 'react';
// Set the body background color to match the form's beige tone
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
			<div className="container py-4" style={{ minHeight: '100vh' }}>
				<header className="mb-4 d-flex align-items-center justify-content-between">
					<Link to="/books" className="btn btn-link p-0" style={{ color: '#8d6748' }}>← Back to books</Link>
					   <h1 className="h3 m-0 book-brown">{id ? 'Update Book' : 'Add a New Book'}</h1>
				</header>
				<main>
					{loading && <div className="alert alert-info book-brown" style={{ background: '#e9e3d0', borderColor: '#d6c7a1' }}>Loading...</div>}
					{error && <div className="alert alert-danger" style={{ background: '#fbeee0', color: '#a94442', borderColor: '#e6c3b2' }}>Error: {error}</div>}
					{success && <div className="alert alert-success" style={{ background: '#e6f4e0', color: '#3c763d', borderColor: '#b7d7b0' }}>Book saved!</div>}
					<form onSubmit={handleSubmit} className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 500, background: '#f5ecd7', border: '1px solid #e0d3b8' }}>
						<div className="mb-3">
							   <label htmlFor="title" className="form-label book-brown">Title</label>
							<input id="title" name="title" className="form-control" style={{ background: '#f9f6f1', borderColor: '#e0d3b8' }} value={form.title} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							   <label htmlFor="author" className="form-label book-brown">Author</label>
							<input id="author" name="author" className="form-control" style={{ background: '#f9f6f1', borderColor: '#e0d3b8' }} value={form.author} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							   <label htmlFor="published_year" className="form-label book-brown">Published Year</label>
							<input id="published_year" name="published_year" type="number" className="form-control" style={{ background: '#f9f6f1', borderColor: '#e0d3b8' }} value={form.published_year} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							   <label htmlFor="genre" className="form-label book-brown">Genre</label>
							<input id="genre" name="genre" className="form-control" style={{ background: '#f9f6f1', borderColor: '#e0d3b8' }} value={form.genre} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							   <label htmlFor="book_category_id" className="form-label book-brown">Category ID</label>
							<input id="book_category_id" name="book_category_id" type="number" className="form-control" style={{ background: '#f9f6f1', borderColor: '#e0d3b8' }} value={form.book_category_id} onChange={handleChange} required />
						</div>
						<div className="mb-3">
							   <label htmlFor="page_count" className="form-label book-brown">Page Count</label>
							<input id="page_count" name="page_count" type="number" className="form-control" style={{ background: '#f9f6f1', borderColor: '#e0d3b8' }} value={form.page_count} onChange={handleChange} required />
						</div>
						<div className="form-check mb-3">
							<input id="read" name="read" type="checkbox" className="form-check-input" checked={form.read} onChange={handleChange} style={{ borderColor: '#bfa77a' }} />
							   <label htmlFor="read" className="form-check-label book-brown">Read</label>
						</div>
						<button type="submit" className="btn w-100" style={{ background: '#bfa77a', color: '#fff', border: 'none' }} disabled={loading}>
							{id ? 'Update Book' : 'Add Book'}
						</button>
					</form>
				</main>
			</div>
		);
}

export default CreateBook;
