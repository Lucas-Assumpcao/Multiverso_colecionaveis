const produtoService = require('../services/produtoService');

async function listar(req, res) {
  if (req.query.nome) {
    try {
      const produtos = await produtoService.buscarPorNome(req.query.nome);
      res.json(produtos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ mensagem: 'Erro ao buscar produtos por nome' });
    }
  } else {
    try {
      const produtos = await produtoService.listarProdutos();
      res.json(produtos);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ mensagem: 'Erro ao buscar produtos' });
    }
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

async function listarProdutosPorCategoria(req, res) {
  try {
    const { categoria } = req.params;
    const produtos = await produtoService.listarProdutosPorCategoria(categoria);
    res.json(produtos);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos por categoria' });
  }
}


module.exports = { listar, buscarPorId, listarProdutosPorCategoria};