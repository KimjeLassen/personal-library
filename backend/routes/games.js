const express = require('express');
const router = express.Router();
const Game = require('../models/game');
const Game_Tag = require('../models/game_tag');

router.get('/', async (req, res) => {
  try {
    const games = await Game.getAll();
    res.status(200).json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const game = await Game.getById(req.params.id);
    res.status(200).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const game = await Game.create(req.body.game);
    const tagPromises = req.body.tags.map(tagName => Game_Tag.createOrGet(tagName));
    const tags = await Promise.all(tagPromises);
    const tagAssignmentPromises = tags.map(tag => Game_Tag.assignGameTag(game.game_id, tag.tag_id))
    const tagAssignments = await Promise.all(tagAssignmentPromises);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put('/order', async (req, res) => {
    try {
        const result = await Game.editOrder(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const game_id = req.params.id;
        const games = await Game.getAllOrderAndId();
        const indexToRemove = games.find(game => game.game_id == game_id).order_index;
        games.splice(games.findIndex(game => game.game_id == game_id), 1);
        const result = await Game.deleteGame(game_id);
        var newResult;
        for (const game of games) {
            if (game.order_index > indexToRemove) {
                game.order_index = game.order_index - 1;
            }
        }
        await Game.editOrder(games);
        res.json(newResult);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
  try {
    const game = await Game.updateGame(req.params.id, req.body.game)
    const existingTags = await Game_Tag.getTagsByGameId(req.params.id);
    const formTags = req.body.tags;
    const overlappingTags = []; 
    const deleteTags = [];
    const names = [];
    for (let tag of existingTags)
    {
        let name = tag.name;
        names.push(name);
        if (formTags.includes(name)) 
        {
          const index = formTags.indexOf(name);
          overlappingTags.push(name)
          formTags.splice(index, 1)
        }
        else
          deleteTags.push(tag.tag_id);
    }

    const tagPromises = req.body.tags.map(tagName => Game_Tag.createOrGet(tagName));
    const tags = await Promise.all(tagPromises);
    const tagAssignmentPromises = tags.map(tag => Game_Tag.assignGameTag(game.game_id, tag.tag_id))
    const tagAssignments = await Promise.all(tagAssignmentPromises);
    const removals = deleteTags.map(tag => Game_Tag.deleteTagAssignment(req.params.id, tag))
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message, game: req.body});
  }
})

module.exports = router;