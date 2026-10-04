const pagamentoService = require('../services/pagamentoService');

async function criar(req, res) {
  try {
    const link = await pagamentoService.criarPreferencia(req.params.pedidoId, req.clienteId);
    res.json({ init_point: link });
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar pagamento' });
  }
}

module.exports = { criar };