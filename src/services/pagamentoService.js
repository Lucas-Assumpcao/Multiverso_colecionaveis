const { Preference } = require('mercadopago');
const client = require('../config/mercadopago');
const pedidoModel = require('../models/pedidoModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');

async function criarPreferencia(pedidoId, clienteId) {
  const pedido = await pedidoModel.buscarPorId(pedidoId, clienteId);
  if (!pedido) throw new ErroDeNegocio('Pedido não encontrado', 404);

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

module.exports = { criarPreferencia };