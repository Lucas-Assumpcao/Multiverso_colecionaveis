const produtoModel = require('../models/produtoModel');

async function listarProdutos() {
  const produtos = await produtoModel.listarTodos();
  return produtos;
}

module.exports = { listarProdutos };