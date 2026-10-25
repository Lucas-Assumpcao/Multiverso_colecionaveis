const pool = require('../config/db');

async function inserir(clienteId, dados) {
  const { cep, logradouro, numero, complemento, bairro, cidade, estado } = dados;
  const [resultado] = await pool.query(
    'INSERT INTO endereco (cliente_id, cep, logradouro, numero, complemento, bairro, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [clienteId, cep, logradouro, numero, complemento || null, bairro, cidade, estado]
  );
  return resultado.insertId;
}

async function pertenceAoCliente(id, clienteId) {
  const [enderecos] = await pool.query(
    'SELECT id FROM endereco WHERE id = ? AND cliente_id = ?',
    [id, clienteId]
  );
  return enderecos.length > 0;
}

module.exports = { inserir, pertenceAoCliente };
