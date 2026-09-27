const mysql = require('mysql2/promise');
require('dotenv').config();

// Pool de conexões: reaproveita conexões abertas em vez de criar uma nova
// a cada requisição — mais rápido e evita estourar o limite do MySQL.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
