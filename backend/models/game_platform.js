const pool = require('../db');

const GamePlatform= {
  async getAll() {
    const res = await pool.query('SELECT * FROM game_platform');
    return res.rows;
  },
  async getById(gamePlatformId) {
    const res = await pool.query('SELECT * FROM game_platform WHERE platform_id = $1', [gamePlatformId]);
    return res.rows[0];
  },
  async create(game_platform) {
    const { name } = game_platform;
    const res = await pool.query(
      'INSERT INTO game_platform (name) VALUES ($1) RETURNING *',
      [name]
    );
    return res.rows[0];
  },
  async update(platform_id, platform) {
    const {name} = platform;
    const res = await pool.query(
      'UPDATE game_platform SET name=$1 WHERE platform_id=$2 RETURNING *',
      [name, platform_id]
    );
    return res.rows[0];
  },
  async delete(platform_id) {
    await pool.query('DELETE FROM game_platform WHERE platform_id = $1', [platform_id]);
    return { message: 'Platform deleted' };
  }
};

module.exports = GamePlatform;
