const pool = require("../db");

const Vinyl = {
  async getAll() {
    const res = await pool.query(`SELECT * FROM vinyl`);
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query(`SELECT * FROM vinyl WHERE vinyl_id = $1`, [
      id,
    ]);
    return res.rows[0];
  },
  async create(vinyl) {
    const { title, artist, release_year, genre } = vinyl;
    const res = await pool.query(`
        INSERT INTO vinyl (title, artist, release_year, genre) 
        VALUES ($1, $2, $3, $4) 
        `, [title, artist, release_year, genre],
    );
    return res.rows[0];
  },
  async delete(id) {
    await pool.query(`DELETE FROM vinyl WHERE vinyl_id = $1`, [id]);
    return { success: true };
  },
  async update(id, vinyl) {
    const { title, artist, release_year, genre } = vinyl;
    const res = await pool.query(
      `UPDATE vinyl SET title=$1, artist=$2, release_year=$3, genre=$4 WHERE vinyl_id=$5`,
      [title, artist, release_year, genre, id],
    );
    return res.rows[0];
  },
};
module.exports = Vinyl;
