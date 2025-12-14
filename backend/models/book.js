const pool = require('../db');

// Book model: CRUD operations
const Book = {
  async getAll() {
    const res = await pool.query('SELECT * FROM Book');
    return res.rows;
  },
  async getById(book_id) {
    const res = await pool.query('SELECT * FROM Book WHERE book_id = $1', [book_id]);
    return res.rows[0];
  },
  async create(book) {
    const { title, author, published_year, genre, book_category_id, page_count, read } = book;
    const res = await pool.query(
      'INSERT INTO Book (title, author, published_year, genre, book_category_id, page_count, read) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, author, published_year, genre, book_category_id, page_count, read]
    );
    return res.rows[0];
  },
  async update(book_id, book) {
    const { title, author, published_year, genre, book_category_id, page_count, read } = book;
    const res = await pool.query(
      'UPDATE Book SET title=$1, author=$2, published_year=$3, genre=$4, book_category_id=$5, page_count=$6, read=$7 WHERE book_id=$8 RETURNING *',
      [title, author, published_year, genre, book_category_id, page_count, read, book_id]
    );
    return res.rows[0];
  },
  async delete(book_id) {
    await pool.query('DELETE FROM Book WHERE book_id = $1', [book_id]);
    return { message: 'Book deleted' };
  }
};

module.exports = Book;
