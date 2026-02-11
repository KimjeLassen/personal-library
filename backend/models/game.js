const pool = require('../db');

const Game = {
    async getAll() {
        const res = await pool.query(`
            SELECT 
            g.*, 
            COALESCE(JSON_AGG(gt.name) FILTER (WHERE gt.name IS NOT NULL), '[]') AS tags
            FROM game g
            LEFT JOIN game_tag_assignment gta ON g.game_id = gta.game_id
            LEFT JOIN game_tag gt ON gta.game_tag_id = gt.tag_id
            GROUP BY g.game_id
            ORDER BY g.order_index;`
        );
        return res.rows;
    },
    async getById(game_id) {
        const res = await pool.query(`
            SELECT 
            g.*, 
            COALESCE(JSON_AGG(gt.name) FILTER (WHERE gt.name IS NOT NULL), '[]') AS tags
            FROM game g
            LEFT JOIN game_tag_assignment gta ON g.game_id = gta.game_id
            LEFT JOIN game_tag gt ON gta.game_tag_id = gt.tag_id
            WHERE g.game_id = $1
            GROUP BY g.game_id;`, [game_id]
        );
        return res.rows[0];
    },
    async create (game) {
        const { title, platform, release_year, genre, finished } = game;
        const res = await pool.query(
            'INSERT INTO game (title, platform, release_year, genre, finished) VALUES ($1,$2,$3,$4,$5) RETURNING *', 
            [title, platform, release_year, genre, finished])
            return res.rows[0];
    },
    async editOrder(games) {
        for (const game of games) {
            const { game_id, order_index } = game; 

            await pool.query(
                'UPDATE game SET order_index = $1 WHERE game_id = $2',
                [order_index, game_id]
            );
        }
        return { success: true };
    },
    async deleteGame(gameId) {
        await pool.query(
            'DELETE FROM game WHERE game_id = $1',
            [gameId]
        );
        return { message: 'Game deleted' };
    },
    async updateGame(game_id, game) {
        const {title, platform, release_year, genre, finished } = game;
        const res = await pool.query(
            'UPDATE game SET title=$1,platform=$2,release_year=$3,genre=$4,finished=$5 WHERE game_id=$6 RETURNING *',
            [title, platform, release_year, genre, finished, game_id]
        )
        return res.rows[0];
    },
    async getAllOrderAndId() {
        const res = await pool.query('SELECT game_id, order_index FROM game ORDER BY order_index');
        return res.rows;
    }
};
module.exports = Game;