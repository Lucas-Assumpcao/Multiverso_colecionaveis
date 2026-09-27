const pool = require('../config/db');

async function inserir(cliente) {
  const { nome, email, senha_hash, cpf } = cliente;
  const [resultado] = await pool.query(
    'INSERT INTO cliente (nome, email, senha_hash, cpf) VALUES (?, ?, ?, ?)',
    [nome, email, senha_hash, cpf]
  );
  return resultado.insertId;
}

module.exports = { inserir };