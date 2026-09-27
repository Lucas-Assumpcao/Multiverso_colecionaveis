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

module.exports = { listar };