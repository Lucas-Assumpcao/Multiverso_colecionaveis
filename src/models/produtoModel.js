const pool = require('../config/db');

async function listarTodos() {
  const [linhas] = await pool.query('SELECT * FROM produto');
  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM produto WHERE id = ?', [id]);
  return linhas[0];
}

async function listarCategoria(categoria_id) {
  const [linhas] = await pool.query('SELECT * FROM produto WHERE categoria_id = ?', [categoria_id]);
  return linhas;
}

module.exports = { listarTodos, buscarPorId, listarCategoria };