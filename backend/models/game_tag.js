const pool = require('../db');

const Game_Tag = {
    async getAll() {
        const res = await pool.query('SELECT * FROM game_tag');
        return res.rows;
    },
    async getById(tag_id) {
        const res = await pool.query('SELECT * FROM game_tag WHERE tag_id = $1', [tag_id])
        return res.rows[0];
    },
    async create(game_tag) {
        const { name, description } = game_tag;
        const res = await pool.query('INSERT INTO game_tag (name, description) VALUES ($1,$2) RETURNING *', [name, description]);
        return res.rows[0];
    },
    async update(tag_id, game_tag) {
        const { name, description } = game_tag;
        const res = await pool.query(
            'UPDATE game_tag SET name = $1, description=$2 WHERE tag_id = $3 RETURNING *',
            [name, description, tag_id]
        )
        return res.rows[0];
    },
    async delete(tag_id) {
        await pool.query('DELETE from game_tag WHERE tag_id = $1', [tag_id])
        return { message: 'Tag deleted' }
    }
}

module.exports = Game_Tag;