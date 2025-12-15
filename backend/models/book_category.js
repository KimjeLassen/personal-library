const pool = require('../db');

// Category model: CRUD operations
const Category = {
  async getAll() {
    const res = await pool.query('SELECT * FROM BookCategory');
    return res.rows;
  },
  async getById(book_category_id) {
    const res = await pool.query('SELECT * FROM BookCategory WHERE book_category_id = $1', [book_category_id]);
    return res.rows[0];
  },
  async create(category) {
    const { name, description } = category;
    const res = await pool.query(
      'INSERT INTO book_category (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    return res.rows[0];
  },
  async update(book_category_id, category) {
    const { name, description } = category;
    const res = await pool.query(
      'UPDATE BookCategory SET name=$1, description=$2 WHERE book_category_id=$3 RETURNING *',
      [name, description, book_category_id]
    );
    return res.rows[0];
  },
  async delete(book_category_id) {
    await pool.query('DELETE FROM BookCategory WHERE book_category_id = $1', [book_category_id]);
    return { message: 'Category deleted' };
  }
};

module.exports = Category;