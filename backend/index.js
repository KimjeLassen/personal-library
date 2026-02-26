require('dotenv').config();
const express = require('express');

const app = express();

// Enable CORS for all origins (for development)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

const port = 3001;


app.use('/api/books', require('./routes/books'));
app.use('/api/books/categories', require('./routes/book_categories'));
app.use('/api/games', require('./routes/games'));
app.use('/api/gameplatforms', require('./routes/game_platforms'));
app.use('/api/gametags', require('./routes/game_tags'));
app.use('/api/vinyls/', require('./routes/vinyls'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});