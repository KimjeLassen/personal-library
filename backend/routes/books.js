const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// GET all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.getAll();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET book by id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create book
router.post('/', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.update(req.params.id, req.body);
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    await Book.delete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
