const produtoModel = require('../models/produtoModel');

async function listarProdutos() {
  const produtos = await produtoModel.listarTodos();
  return produtos;
}

async function buscarPorId(id) {
  const produto = await produtoModel.buscarPorId(id);
  return produto;
}

async function listarProdutosPorCategoria(categoria_id) {
  const produtos = await produtoModel.listarCategoria(categoria_id);
  return produtos;
}

async function buscarPorNome(nome) {
  const produtos = await produtoModel.buscarPorNome(nome);
  return produtos;
}

module.exports = { listarProdutos, buscarPorId, listarProdutosPorCategoria, buscarPorNome };