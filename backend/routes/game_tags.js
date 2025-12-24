const express = require('express');
const router = express.Router();
const game_tag = require('../models/game_tag');

router.get('/', async (req, res) => {
  try {
    const tag = await game_tag.getAll();
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:id', async (req, res) => {
    try {
        const platform = await game_tag.getById(req.params.id);
        res.status(200).json(platform);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
router.post('/', async (req, res) => {
    try {
        const tag = await game_tag.create(req.body);
        res.status(201).json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
  try {
    const tag = await game_tag.update(req.params.id, req.body)
    res.json(tag);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const status = await game_tag.delete(req.params.id);
    res.json({message: 'Tag deleted'});
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router;