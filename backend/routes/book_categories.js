const express = require('express');
const router = express.Router();
const Category = require('../models/book_category');

// GET all categories
router.get('/', async (req, res) => {
	try {
		const categories = await Category.getAll();
		res.status(200).json(categories);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// GET category by id
router.get('/:id', async (req, res) => {
	try {
		const category = await Category.getById(req.params.id);
		if (!category) return res.status(404).json({ error: 'Category not found' });
		res.json(category);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// POST create category
router.post('/', async (req, res) => {
	try {
		const category = await Category.create(req.body);
		res.status(201).json(category);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// PUT update category
router.put('/:id', async (req, res) => {
	try {
		const category = await Category.update(req.params.id, req.body);
		res.json(category);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// DELETE category
router.delete('/:id', async (req, res) => {
	try {
		await Category.delete(req.params.id);
		res.json({ message: 'Category deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
