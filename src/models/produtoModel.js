const pool = require('../config/db');

async function listarTodos() {
  const [linhas] = await pool.query('SELECT * FROM produto');
  return linhas;
}

module.exports = { listarTodos };