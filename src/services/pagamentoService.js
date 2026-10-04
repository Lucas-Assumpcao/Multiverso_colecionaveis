const { Preference } = require('mercadopago');
const client = require('../config/mercadopago');
const pedidoModel = require('../models/pedidoModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');
const pagamentoModel = require('../models/pagamentoModel');
const { Payment } = require('mercadopago');

async function criarPreferencia(pedidoId, clienteId) {
  const pedido = await pedidoModel.buscarPorId(pedidoId, clienteId);
  if (!pedido) throw new ErroDeNegocio('Pedido não encontrado', 404);

  await pagamentoModel.inserir(pedidoId);
  
  const preference = new Preference(client);

  const resultado = await preference.create({
    body: {
      items: pedido.itens.map((item) => ({
        title: item.nome,
        quantity: item.quantidade,
        unit_price: Number(item.preco_unitario),
        currency_id: 'BRL',
      })),
      external_reference: String(pedidoId), // liga o pagamento ao seu pedido
      back_urls: {
        success: 'http://localhost:5173/confirmacao',
        failure: 'http://localhost:5173/pagamento',
        pending: 'http://localhost:5173/confirmacao',
      },
    },
  });

  return resultado.init_point; // URL do checkout
}

async function processarWebhook(paymentId) {
  const payment = new Payment(client);
  const dados = await payment.get({ id: paymentId });

  const pedidoId = dados.external_reference;
  if (!pedidoId) return; // notificação sem referência nossa, ignora

  const statusPagamento =
    dados.status === 'approved' ? 'aprovado' :
    dados.status === 'rejected' ? 'recusado' : 'pendente';

  const metodoMap = {
    credit_card: 'cartao', debit_card: 'cartao',
    ticket: 'boleto', bank_transfer: 'pix', pix: 'pix',
  };

  await pagamentoModel.atualizarPorPedido(pedidoId, {
    metodo: metodoMap[dados.payment_type_id] || null,
    status: statusPagamento,
    transacaoId: String(dados.id),
  });

  if (dados.status === 'approved') {
    await pedidoModel.atualizarStatus(pedidoId, 'pago');
  } else if (dados.status === 'rejected') {
    await pedidoModel.atualizarStatus(pedidoId, 'cancelado');
  }
}

module.exports = { criarPreferencia, processarWebhook };