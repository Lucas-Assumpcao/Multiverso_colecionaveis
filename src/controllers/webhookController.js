const pagamentoService = require('../services/pagamentoService');

async function mercadoPago(req, res) {
  try {
    const paymentId = req.query['data.id'] || req.body?.data?.id;
    const tipo = req.query.type || req.body?.type;

    if (tipo === 'payment' && paymentId) {
      await pagamentoService.processarWebhook(paymentId);
    }

    res.sendStatus(200);
  } catch (erro) {
    console.error(erro);
    res.sendStatus(200); // sempre 200 — evita que o Mercado Pago reenvie em loop
  }
}

module.exports = { mercadoPago };