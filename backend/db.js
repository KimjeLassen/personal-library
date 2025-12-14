require('dotenv').config({ path: '../.env' }); // Adjust path based on your exact structure

console.log('PGPASSWORD type:', typeof process.env.PGPASSWORD, 'value:', process.env.PGPASSWORD ? '***set***' : 'undefined or empty');
const { Pool } = require('pg');

const pool = new Pool();

module.exports = pool;
