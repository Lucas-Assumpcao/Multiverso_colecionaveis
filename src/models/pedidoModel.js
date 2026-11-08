const { pool } = require('../config/db');
const ErroDeNegocio = require('../utils/ErroDeNegocio');

function idPositivo(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function criar(pedido, itens) {
  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const [resultadoPedido] = await conexao.query(
      `INSERT INTO pedido (cliente_id, endereco_id, status, valor_frete, valor_total)
       VALUES (?, ?, 'aguardando_pagamento', ?, ?)`,
      [pedido.cliente_id, pedido.endereco_id, pedido.valor_frete, pedido.valor_total]
    );
    const pedidoId = resultadoPedido.insertId;

    for (const item of itens) {
      const [resultadoEstoque] = await conexao.query(
        'UPDATE produto SET estoque = estoque - ? WHERE id = ? AND estoque >= ?',
        [item.quantidade, item.produto_id, item.quantidade]
      );
      if (resultadoEstoque.affectedRows !== 1) {
        throw new ErroDeNegocio('Estoque insuficiente', 409);
      }
      await conexao.query(
        `INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES (?, ?, ?, ?)`,
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

async function listarPorCliente(clienteId) {
  const id = idPositivo(clienteId);
  if (!id) return [];
  const [linhas] = await pool.query(
    'SELECT * FROM pedido WHERE cliente_id = ? ORDER BY data_pedido DESC',
    [id]
  );
  return linhas;
}

async function buscarPorId(pedidoId, clienteId) {
  const id = idPositivo(pedidoId);
  const donoId = idPositivo(clienteId);
  if (!id || !donoId) return null;

  const [pedidos] = await pool.query(
    'SELECT * FROM pedido WHERE id = ? AND cliente_id = ?',
    [id, donoId]
  );
  if (!pedidos.length) return null;

  const [itens] = await pool.query(
    `SELECT ip.produto_id, ip.quantidade, ip.preco_unitario, p.nome
     FROM item_pedido ip
     JOIN produto p ON p.id = ip.produto_id
     WHERE ip.pedido_id = ? ORDER BY ip.id`,
    [id]
  );
  return { ...pedidos[0], itens };
}

async function listarTodos() {
  const [linhas] = await pool.query(
    `SELECT p.*, c.nome AS cliente_nome
     FROM pedido p
     JOIN cliente c ON c.id = p.cliente_id
     ORDER BY p.data_pedido DESC`
  );
  return linhas;
}

async function atualizarStatus(id, status) {
  const pedidoId = idPositivo(id);
  if (!pedidoId) return null;
  const [resultado] = await pool.query('UPDATE pedido SET status = ? WHERE id = ?', [status, pedidoId]);
  return resultado.affectedRows;
}

module.exports = { criar, listarPorCliente, buscarPorId, listarTodos, atualizarStatus };
