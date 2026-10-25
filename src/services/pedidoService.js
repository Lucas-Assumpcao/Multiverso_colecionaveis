const produtoModel = require('../models/produtoModel');
const pedidoModel = require('../models/pedidoModel');
const enderecoModel = require('../models/enderecoModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');
const { FRETE_FIXO } = require('../config/negocio');

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

async function criarPedido(dados) {
  const { cliente_id, endereco_id, itens } = dados;

  if (!Number.isInteger(endereco_id) || endereco_id <= 0) {
    throw new ErroDeNegocio('endereco_id deve ser um inteiro maior que zero', 400);
  }
  if (!Array.isArray(itens) || itens.length === 0 || itens.length > 50) {
    throw new ErroDeNegocio('itens deve ser um array nao vazio com no maximo 50 itens', 400);
  }
  for (const item of itens) {
    if (!item || !Number.isInteger(item.produto_id) || item.produto_id <= 0) {
      throw new ErroDeNegocio('Cada item precisa ter produto_id inteiro maior que zero', 400);
    }
    if (!Number.isInteger(item.quantidade) || item.quantidade < 1 || item.quantidade > 99) {
      throw new ErroDeNegocio('Cada quantidade deve ser um inteiro entre 1 e 99', 400);
    }
  }

  const itensAgrupados = new Map();
  for (const item of itens) {
    itensAgrupados.set(item.produto_id, (itensAgrupados.get(item.produto_id) || 0) + item.quantidade);
  }

  const enderecoPertenceAoCliente = await enderecoModel.pertenceAoCliente(endereco_id, cliente_id);
  if (!enderecoPertenceAoCliente) {
    throw new ErroDeNegocio('Endere\u00e7o n\u00e3o encontrado', 404);
  }

  let valorTotal = FRETE_FIXO;
  const itensCompletos = [];
  for (const [produtoId, quantidade] of itensAgrupados) {
    const produto = await produtoModel.buscarPorId(produtoId);
    if (!produto) {
      throw new ErroDeNegocio('Produto com ID ' + produtoId + ' nao encontrado', 404);
    }
    if (produto.estoque < quantidade) {
      throw new ErroDeNegocio('Estoque insuficiente', 409);
    }

    const precoUnitario = Number(produto.preco);
    itensCompletos.push({ produto_id: produto.id, quantidade, preco_unitario: precoUnitario });
    valorTotal += precoUnitario * quantidade;
  }

  return pedidoModel.criar(
    {
      cliente_id,
      endereco_id,
      valor_frete: FRETE_FIXO,
      valor_total: arredondar(valorTotal),
    },
    itensCompletos
  );
}

async function listarPedidosCliente(clienteId) {
  return pedidoModel.listarPorCliente(clienteId);
}

async function buscarPedido(id, clienteId) {
  const pedido = await pedidoModel.buscarPorId(id, clienteId);
  if (!pedido) throw new ErroDeNegocio('Pedido n\u00e3o encontrado', 404);
  return pedido;
}

async function listarTodosPedidos() {
  return pedidoModel.listarTodos();
}

async function atualizarStatusPedido(id, status) {
  const validos = ['aguardando_pagamento', 'pago', 'enviado', 'entregue', 'cancelado'];
  if (!validos.includes(status)) {
    throw new ErroDeNegocio('Status inv\u00e1lido', 400);
  }
  await pedidoModel.atualizarStatus(id, status);
}

module.exports = { criarPedido, listarPedidosCliente, buscarPedido, listarTodosPedidos, atualizarStatusPedido };
