const pool = require('../config/db');

async function inserir(cliente) {
  const { nome, email, senha_hash, cpf } = cliente;
  const [resultado] = await pool.query(
    'INSERT INTO cliente (nome, email, senha_hash, cpf) VALUES (?, ?, ?, ?)',
    [nome, email, senha_hash, cpf]
  );
  return resultado.insertId;
}

async function buscarPorEmail(email) {
  const [linhas] = await pool.query('SELECT * FROM cliente WHERE email = ?', [email]);
  return linhas[0];
}

module.exports = { inserir, buscarPorEmail };