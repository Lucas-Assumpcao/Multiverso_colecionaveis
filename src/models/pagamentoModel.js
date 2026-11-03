const { Pagamento } = require('./documentos');
const { proximoId } = require('./contadorModel');
const { idNumerico } = require('./mongoUtils');

async function inserir(pedidoId) {
  const pagamento = await Pagamento.create({
    id: await proximoId('pagamentos'),
    pedido_id: pedidoId,
  });
  return pagamento.id;
}

async function atualizarPorPedido(pedidoId, { metodo, status, transacaoId }) {
  const id = idNumerico(pedidoId);
  if (id === null) return null;

  return Pagamento.updateMany(
    { pedido_id: id },
    {
      $set: {
        metodo,
        status,
        transacao_id: transacaoId,
        data_pagamento: new Date(),
      },
    },
    { runValidators: true }
  );
}

module.exports = { inserir, atualizarPorPedido };
