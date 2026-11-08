const { pool } = require('../config/db');

async function inserir(clienteId, dados) {
  const { cep, logradouro, numero, complemento, bairro, cidade, estado } = dados;
  const [resultado] = await pool.query(
    `INSERT INTO endereco
      (cliente_id, cep, logradouro, numero, complemento, bairro, cidade, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [clienteId, cep, logradouro, numero, complemento || null, bairro, cidade, estado]
  );
  return resultado.insertId;
}

async function pertenceAoCliente(id, clienteId) {
  const enderecoId = Number(id);
  const donoId = Number(clienteId);
  if (!Number.isSafeInteger(enderecoId) || enderecoId < 1 || !Number.isSafeInteger(donoId) || donoId < 1) {
    return false;
  }

  const [linhas] = await pool.query(
    'SELECT id FROM endereco WHERE id = ? AND cliente_id = ?',
    [enderecoId, donoId]
  );
  return linhas.length > 0;
}

module.exports = { inserir, pertenceAoCliente };
