const pool = require('../config/db');

async function criar(pedido, itens) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();

    const [resultadoPedido] = await conexao.query(
      'INSERT INTO pedido (cliente_id, endereco_id, status, valor_frete, valor_total) VALUES (?, ?, ?, ?, ?)',
      [pedido.cliente_id, pedido.endereco_id, 'aguardando_pagamento', pedido.valor_frete, pedido.valor_total]
    );
    const pedidoId = resultadoPedido.insertId;

   for (const item of itens) {
      await conexao.query(
        'INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }
    
    await conexao.commit();
    return pedidoId;
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
}

module.exports = { criar };