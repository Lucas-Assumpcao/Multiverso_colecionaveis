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
async function criar(req, res) {
  try {
    const { categoria_id, nome, preco, estoque } = req.body;
    if (!categoria_id || !nome || preco === undefined || estoque === undefined) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios faltando' });
    }
    const id = await produtoService.criar(req.body);
    res.status(201).json({ id });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar produto' });
  }
}

async function atualizar(req, res) {
  try {
    await produtoService.atualizar(req.params.id, req.body);
    res.json({ mensagem: 'Produto atualizado' });
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao atualizar produto' });
  }
}

async function remover(req, res) {
  try {
    await produtoService.remover(req.params.id);
    res.json({ mensagem: 'Produto removido' });
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao remover produto' });
  }
}

module.exports = { listar, buscarPorId, listarProdutosPorCategoria, criar, atualizar, remover };