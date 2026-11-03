const { Categoria, Pedido, Produto } = require('./documentos');
const { proximoId } = require('./contadorModel');
const ErroDeNegocio = require('../utils/ErroDeNegocio');
const { idNumerico, serializar } = require('./mongoUtils');

async function listarTodos() {
  const produtos = await Produto.find().sort({ id: 1 }).lean();
  return produtos.map(serializar);
}

async function buscarPorId(id) {
  const produtoId = idNumerico(id);
  if (produtoId === null) return null;

  return serializar(await Produto.findOne({ id: produtoId }).lean());
}

async function listarCategoria(categoriaId) {
  const id = idNumerico(categoriaId);
  if (id === null) return [];

  const produtos = await Produto.find({ categoria_id: id }).sort({ id: 1 }).lean();
  return produtos.map(serializar);
}

async function buscarPorNome(nome) {
  const produtos = await Produto.find({
    nome: { $regex: escaparRegex(nome), $options: 'i' },
  }).sort({ id: 1 }).lean();
  return produtos.map(serializar);
}

async function inserir(produto) {
  const categoriaId = idNumerico(produto.categoria_id);
  if (categoriaId === null || !await Categoria.exists({ id: categoriaId })) {
    throw new ErroDeNegocio('Categoria não encontrada', 404);
  }

  const novoProduto = await Produto.create({
    categoria_id: categoriaId,
    nome: produto.nome,
    descricao: produto.descricao ?? null,
    preco: produto.preco,
    estoque: produto.estoque,
    imagem_url: produto.imagem_url || null,
    id: await proximoId('produtos'),
  });
  return novoProduto.id;
}

async function atualizar(id, produto) {
  const produtoId = idNumerico(id);
  const categoriaId = idNumerico(produto.categoria_id);
  if (categoriaId === null || !await Categoria.exists({ id: categoriaId })) {
    throw new ErroDeNegocio('Categoria não encontrada', 404);
  }
  if (produtoId === null) return null;

  const dadosAtualizados = await Produto.findOneAndUpdate(
    { id: produtoId },
    {
      categoria_id: categoriaId,
      nome: produto.nome,
      descricao: produto.descricao ?? null,
      preco: produto.preco,
      estoque: produto.estoque,
      imagem_url: produto.imagem_url || null,
    },
    { new: true, runValidators: true }
  ).lean();
  return serializar(dadosAtualizados);
}

async function remover(id) {
  const produtoId = idNumerico(id);
  if (produtoId === null) return null;

  if (await Pedido.exists({ 'itens.produto_id': produtoId })) {
    throw new ErroDeNegocio('Produto vinculado a pedido e não pode ser removido', 409);
  }

  return serializar(await Produto.findOneAndDelete({ id: produtoId }).lean());
}

function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { listarTodos, buscarPorId, listarCategoria, buscarPorNome, inserir, atualizar, remover };
