const { pool } = require('../config/db');

async function inserir(cliente) {
  const { nome, email, senha_hash, cpf } = cliente;
  const [resultado] = await pool.query(
    'INSERT INTO cliente (nome, email, senha_hash, cpf) VALUES (?, ?, ?, ?)',
    [nome, String(email).trim().toLowerCase(), senha_hash, cpf || null]
  );
  return resultado.insertId;
}

async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT id, nome, email, senha_hash, cpf, data_cadastro FROM cliente WHERE email = ?',
    [String(email).trim().toLowerCase()]
  );
  return linhas[0] || null;
}

module.exports = { inserir, buscarPorEmail };
