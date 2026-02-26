const express = require('express');
const router = express.router();
const Vinyl = requre('../models/vinyl');

router.get('/', async (req, res) => {
    try {
        const vinyls = await Vinyl.getAll();
        res.status(200).json(vinyls);
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/:id', async (req, res) => {
  try {
    const vinyl = await Vinyl.getById(req.params.id);
    res.status(200).json(vinyl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
        const vinyl = await Vinyl.create(req.body);
        res.status(201).json(vinyl);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.put('/:id', async (req, res) => {
  try {
    const vinyl = await Vinyl.update(req.params.id, req.body);
    res.json(vinyl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Vinyl.delete(req.params.id);
    res.json({ message: 'Vinyl deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;