const pool = require('../config/db');

async function buscarPorEmail(email) {
  const [linhas] = await pool.query('SELECT * FROM usuario_admin WHERE email = ?', [email]);
  return linhas[0];
}

module.exports = { buscarPorEmail };