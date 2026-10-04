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

      await conexao.query(
        'UPDATE produto SET estoque = estoque - ? WHERE id = ?',
        [item.quantidade, item.produto_id]
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

async function listarPorCliente(clienteId) {
  const [pedidos] = await pool.query(
    'SELECT * FROM pedido WHERE cliente_id = ? ORDER BY data_pedido DESC',
    [clienteId]
  );
  return pedidos;
}

async function buscarPorId(id, clienteId) {
  const [pedidos] = await pool.query(
    'SELECT * FROM pedido WHERE id = ? AND cliente_id = ?',
    [id, clienteId]
  );
  if (pedidos.length === 0) return null;

  const [itens] = await pool.query(
    `SELECT ip.produto_id, ip.quantidade, ip.preco_unitario, p.nome
     FROM item_pedido ip
     JOIN produto p ON p.id = ip.produto_id
     WHERE ip.pedido_id = ?`,
    [id]
  );

  return { ...pedidos[0], itens };
}
async function listarTodos() {
  const [pedidos] = await pool.query(
    'SELECT p.*, c.nome AS cliente_nome FROM pedido p JOIN cliente c ON c.id = p.cliente_id ORDER BY p.data_pedido DESC'
  );
  return pedidos;
}

async function atualizarStatus(id, status) {
  await pool.query('UPDATE pedido SET status = ? WHERE id = ?', [status, id]);
}
module.exports = { criar, listarPorCliente, buscarPorId, listarTodos, atualizarStatus };