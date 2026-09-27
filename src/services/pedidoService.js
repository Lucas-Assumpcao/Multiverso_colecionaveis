const produtoModel = require('../models/produtoModel');
const pedidoModel = require('../models/pedidoModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');

async function criarPedido(dados) {
  const {  cliente_id, endereco_id, itens, valor_frete } = dados;

  let valorTotal = valor_frete;
  const itensCompletos = [];

  for (const item of itens) {
    const produto = await produtoModel.buscarPorId(item.produto_id);

   if (!produto) {
      throw new ErroDeNegocio(`Produto com ID ${item.produto_id} não encontrado`, 404);
    }
    if (produto.estoque < item.quantidade) {
      throw new ErroDeNegocio(`Estoque insuficiente para o produto com ID ${item.produto_id}`, 409);
    }
   
    itensCompletos.push({
      produto_id: produto.id,
      quantidade: item.quantidade,
      preco_unitario: produto.preco
    });

    valorTotal += produto.preco * item.quantidade;
  }

  const pedidoId = await pedidoModel.criar(
    { cliente_id, endereco_id, valor_frete, valor_total: valorTotal },
    itensCompletos
  );

  return pedidoId;
}

module.exports = { criarPedido };