const produtoModel = require('../models/produtoModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');

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
async function criar(dados) {
  return produtoModel.inserir(dados);
}

async function atualizar(id, dados) {
  const existe = await produtoModel.buscarPorId(id);
  if (!existe) throw new ErroDeNegocio('Produto não encontrado', 404);
  await produtoModel.atualizar(id, dados);
}

async function remover(id) {
  const existe = await produtoModel.buscarPorId(id);
  if (!existe) throw new ErroDeNegocio('Produto não encontrado', 404);
  await produtoModel.remover(id);
}

module.exports = { listarProdutos, buscarPorId, listarProdutosPorCategoria, buscarPorNome, criar, atualizar, remover };