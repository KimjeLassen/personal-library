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


// Book routes
app.use('/api/books', require('./routes/books'));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});