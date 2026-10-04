const pedidoService = require('../services/pedidoService');

async function criar(req, res) {
  try {
    const { endereco_id, itens, valor_frete } = req.body;
    const cliente_id = req.clienteId; // veio do middleware, não do body

    const pedidoId = await pedidoService.criarPedido({ cliente_id, endereco_id, itens, valor_frete });
    res.status(201).json({ id: pedidoId, mensagem: 'Pedido criado com sucesso' });

  } catch (erro) {
    if (erro.status) {
      return res.status(erro.status).json({ mensagem: erro.message });
    }
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar pedido' });
  }
}
async function listarPedidosCliente(clienteId) {
  return pedidoModel.listarPorCliente(clienteId);
}

async function buscarPedido(id, clienteId) {
  const pedido = await pedidoModel.buscarPorId(id, clienteId);
  if (!pedido) throw new ErroDeNegocio('Pedido não encontrado', 404);
  return pedido;
}
module.exports = { criar, listarPedidosCliente, buscarPedido };