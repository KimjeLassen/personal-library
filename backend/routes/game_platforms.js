const express = require('express');
const router = express.Router();
const Platform = require('../models/game_platform');

router.get('/', async (req, res) => {
  try {
    const platforms = await Platform.getAll();
    res.status(200).json(platforms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/:id', async (req, res) => {
    try {
        const platform = await Platform.getById(req.params.id);
        res.status(200).json(platform);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
router.post('/', async (req, res) => {
    try {
        const platform = Platform.create(req.body)
        res.status(201).json(platform);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/:id', async (req, res) => {
  try {
    const platform = Platform.update(req.params.id, req.body)
    res.json(platform);
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const status = Platform.delete(req.params.id);
    res.json({message: 'Platform deleted'});
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
module.exports = router;