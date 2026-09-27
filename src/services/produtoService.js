const produtoModel = require('../models/produtoModel');

async function listarProdutos() {
  const produtos = await produtoModel.listarTodos();
  return produtos;
}

async function buscarPorId(id) {
  const produto = await produtoModel.buscarPorId(id);
  return produto;
}

module.exports = { listarProdutos, buscarPorId };