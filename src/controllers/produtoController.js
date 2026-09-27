const produtoService = require('../services/produtoService');

async function listar(req, res) {
  try {
    const produtos = await produtoService.listarProdutos();
    res.json(produtos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos' });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const produto = await produtoService.buscarPorId(id);

    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.json(produto);

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produto' });
  }
}

module.exports = { listar, buscarPorId };