const categoriaService = require('../services/categoriaService');

async function listar(req, res) {
  try {
    const categorias = await categoriaService.listarCategorias();
    res.json(categorias);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar categorias' });
  }
}

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const categoria = await categoriaService.buscarPorId(id);

    if (!categoria) {
      return res.status(404).json({ mensagem: 'Categoria não encontrada' });
    }

    res.json(categoria);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar categoria' });
  }
}

module.exports = { listar, buscarPorId};