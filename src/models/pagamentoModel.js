const { pool } = require('../config/db');

async function inserir(pedidoId) {
  const [resultado] = await pool.query(
    'INSERT INTO pagamento (pedido_id, metodo, status) VALUES (?, NULL, ?)',
    [pedidoId, 'pendente']
  );
  return resultado.insertId;
}

async function atualizarPorPedido(pedidoId, { metodo, status, transacaoId }) {
  const id = Number(pedidoId);
  if (!Number.isSafeInteger(id) || id < 1) return null;

  const [resultado] = await pool.query(
    `UPDATE pagamento
     SET metodo = ?, status = ?, transacao_id = ?, data_pagamento = CURRENT_TIMESTAMP
     WHERE pedido_id = ?`,
    [metodo || null, status, transacaoId || null, id]
  );
  return resultado.affectedRows;
}

module.exports = { inserir, atualizarPorPedido };
