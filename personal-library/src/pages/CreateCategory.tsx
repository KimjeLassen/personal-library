import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

interface CategoryForm{
    name: string;
    description: string;
}

const defaultForm: CategoryForm = {
	name: '',
	description: '',
};

function CreateBookCategory() {
	//const { id } = useParams<{ id?: string }>();
	const [form, setForm] = useState<CategoryForm>(defaultForm);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

//	useEffect(() => {
//		if (id) {
//			setLoading(true);
//			fetch(`http://localhost:3001/api/categories/${id}`)
//				.then((res) => {
//					if (!res.ok) throw new Error('Category not found');
//					return res.json();
//				})
//				.then((data) => {
//					setForm({
//						name: data.name,
//						description: data.description,
//					});
//					setLoading(false);
//				})
//				.catch((err) => {
//					setError(err.message);
//					setLoading(false);
//				});
//		}
//	}, [id]);

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
		//const method = id ? 'PUT' : 'POST';
        const method = 'POST';
	//	const url = id ? `http://localhost:3001/api/books/${id}` : 'http://localhost:3001/api/books';
        const url = `http://localhost:3001/api/books/categories/`;
		fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(form),
		})
			.then((res) => {
				if (!res.ok) throw new Error('Failed to save category');
				return res.json();
			})
			.then(() => {
				setSuccess(true);
				setLoading(false);
				setTimeout(() => navigate('/'), 1000);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	};

	return (
		<div className="page-container">
			<header className="page-header">
				<Link to={"/books"} className="back-link">← Back to Books</Link>
				<h1 className="page-title">{'Add a New category'}</h1>
			</header>
            <main className="page-content">
                {loading && <p>Loading...</p>}
                {error && <p className="error">Error: {error}</p>}
                {success && <p className="success">Category saved!</p>}
                <form onSubmit={handleSubmit} className="book-form">
                    <label>
                        Name:
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </label>
                    <label>
                        Description:
                        <input name="description" value={form.description} onChange={handleChange} required />
                    </label>
                    <button type="submit" disabled={loading}>{'Add Category'}</button>
                </form>
            </main>
		</div>
	);
}

export default CreateBookCategory;
