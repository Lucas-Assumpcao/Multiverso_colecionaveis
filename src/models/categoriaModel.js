const pool = require('../config/db');

async function listarTodos() {
  const [linhas] = await pool.query('SELECT * FROM categoria');
  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM categoria WHERE id = ?', [id]);
  return linhas[0];
}


module.exports = { listarTodos, buscarPorId};