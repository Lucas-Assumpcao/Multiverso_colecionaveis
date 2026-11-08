const { pool } = require('../config/db');

async function listarTodos() {
  const [linhas] = await pool.query('SELECT id, nome FROM categoria ORDER BY id');
  return linhas;
}

async function buscarPorId(id) {
  const categoriaId = Number(id);
  if (!Number.isSafeInteger(categoriaId) || categoriaId < 1) return null;

  const [linhas] = await pool.query('SELECT id, nome FROM categoria WHERE id = ?', [categoriaId]);
  return linhas[0] || null;
}

module.exports = { listarTodos, buscarPorId };
