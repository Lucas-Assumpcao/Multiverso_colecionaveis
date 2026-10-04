const pedidoService = require('../services/pedidoService');

async function criar(req, res) {
  try {
    const { endereco_id, itens, valor_frete } = req.body;
    const cliente_id = req.clienteId;

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

async function listar(req, res) {
  try {
    const pedidos = await pedidoService.listarPedidosCliente(req.clienteId);
    res.json(pedidos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao listar pedidos' });
  }
}

async function buscarPorId(req, res) {
  try {
    const pedido = await pedidoService.buscarPedido(req.params.id, req.clienteId);
    res.json(pedido);
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar pedido' });
  }
}

module.exports = { criar, listar, buscarPorId };