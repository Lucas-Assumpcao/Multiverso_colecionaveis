const pool = require('../config/db');

async function inserir(pedidoId) {
  const [resultado] = await pool.query(
    'INSERT INTO pagamento (pedido_id, metodo, status) VALUES (?, ?, ?)',
    [pedidoId, null, 'pendente']
  );
  return resultado.insertId;
}

async function atualizarPorPedido(pedidoId, { metodo, status, transacaoId }) {
  await pool.query(
    'UPDATE pagamento SET metodo = ?, status = ?, transacao_id = ?, data_pagamento = NOW() WHERE pedido_id = ?',
    [metodo, status, transacaoId, pedidoId]
  );
}

module.exports = { inserir, atualizarPorPedido };