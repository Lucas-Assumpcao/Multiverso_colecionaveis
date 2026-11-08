const { pool } = require('../config/db');

async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT * FROM usuario_admin WHERE email = ?',
    [String(email).trim().toLowerCase()]
  );
  return linhas[0] || null;
}

module.exports = { buscarPorEmail };
