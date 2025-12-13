require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();

// Enable CORS for all origins (for development)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const port = 3001;


const pool = new Pool();

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Database connection error:', err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});