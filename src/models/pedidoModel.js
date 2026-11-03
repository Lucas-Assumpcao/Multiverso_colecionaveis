const { mongoose } = require('../config/db');
const { Cliente, Pedido, Produto } = require('./documentos');
const { proximoId } = require('./contadorModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');
const { idNumerico, serializar } = require('./mongoUtils');

async function criar(pedido, itens) {
  const sessao = await mongoose.startSession();
  let pedidoId;

  try {
    await sessao.withTransaction(async () => {
      const itensDoPedido = [];

      for (const item of itens) {
        const produto = await Produto.findOneAndUpdate(
          { id: item.produto_id, estoque: { $gte: item.quantidade } },
          { $inc: { estoque: -item.quantidade } },
          { new: true, session: sessao }
        );

        if (!produto) {
          throw new ErroDeNegocio('Estoque insuficiente', 409);
        }

        itensDoPedido.push({
          produto_id: produto.id,
          nome: produto.nome,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
        });
      }

      pedidoId = await proximoId('pedidos');
      const novoPedido = new Pedido({
        ...pedido,
        id: pedidoId,
        itens: itensDoPedido,
      });
      await novoPedido.save({ session: sessao });
    });

    return pedidoId;
  } finally {
    await sessao.endSession();
  }
}

async function listarPorCliente(clienteId) {
  const id = idNumerico(clienteId);
  if (id === null) return [];

  const pedidos = await Pedido.find({ cliente_id: id }).sort({ data_pedido: -1 }).lean();
  return pedidos.map(serializar);
}

async function buscarPorId(id, clienteId) {
  const pedidoId = idNumerico(id);
  const donoId = idNumerico(clienteId);
  if (pedidoId === null || donoId === null) return null;

  return serializar(await Pedido.findOne({
    id: pedidoId,
    cliente_id: donoId,
  }).lean());
}

async function listarTodos() {
  const pedidos = await Pedido.find().sort({ data_pedido: -1 }).lean();
  const clientesIds = [...new Set(pedidos.map((pedido) => pedido.cliente_id))];
  const clientes = await Cliente.find({ id: { $in: clientesIds } }).select({ id: 1, nome: 1 }).lean();
  const nomesPorId = new Map(clientes.map((cliente) => [cliente.id, cliente.nome]));

  return pedidos.map((pedido) => ({
    ...serializar(pedido),
    cliente_nome: nomesPorId.get(pedido.cliente_id) || null,
  }));
}

async function atualizarStatus(id, status) {
  const pedidoId = idNumerico(id);
  if (pedidoId === null) return null;

  return serializar(await Pedido.findOneAndUpdate(
    { id: pedidoId },
    { status },
    { new: true, runValidators: true }
  ).lean());
}

module.exports = { criar, listarPorCliente, buscarPorId, listarTodos, atualizarStatus };
