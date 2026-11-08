const produtoService = require('../services/produtoService');

function erroValidacaoProduto(produto) {
  const categoriaId = Number(produto?.categoria_id);
  const preco = Number(produto?.preco);
  const estoque = Number(produto?.estoque);
  const nome = typeof produto?.nome === 'string' ? produto.nome.trim() : '';
  const descricaoValida = produto?.descricao == null || typeof produto.descricao === 'string';
  const imagemValida = produto?.imagem_url == null || typeof produto.imagem_url === 'string';

  if (!Number.isSafeInteger(categoriaId) || categoriaId < 1) return 'categoria_id deve ser um inteiro positivo';
  if (!nome || nome.length > 150) return 'nome deve ter entre 1 e 150 caracteres';
  if (produto?.preco == null || String(produto.preco).trim() === '' || !Number.isFinite(preco) || preco < 0 || preco > 99999999.99) return 'preco deve ser um valor não negativo válido';
  if (produto?.estoque == null || String(produto.estoque).trim() === '') return 'estoque é obrigatório';
  if (!Number.isSafeInteger(estoque) || estoque < 0) return 'estoque deve ser um inteiro não negativo';
  if (!descricaoValida || !imagemValida || (produto.imagem_url && produto.imagem_url.length > 255)) {
    return 'descricao ou imagem_url inválida';
  }
  return null;
}

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
    const erro = erroValidacaoProduto(req.body);
    if (erro) return res.status(400).json({ mensagem: erro });
    const id = await produtoService.criar(req.body);
    res.status(201).json({ id });
  } catch (erro) {
    if (erro.status) return res.status(erro.status).json({ mensagem: erro.message });
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar produto' });
  }
}

async function atualizar(req, res) {
  try {
    const erro = erroValidacaoProduto(req.body);
    if (erro) return res.status(400).json({ mensagem: erro });
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
