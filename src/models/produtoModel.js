const { pool } = require('../config/db');
const ErroDeNegocio = require('../utils/ErroDeNegocio');

function idPositivo(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

async function listarTodos() {
  const [linhas] = await pool.query('SELECT * FROM produto ORDER BY id');
  return linhas;
}

async function buscarPorId(id) {
  const produtoId = idPositivo(id);
  if (!produtoId) return null;
  const [linhas] = await pool.query('SELECT * FROM produto WHERE id = ?', [produtoId]);
  return linhas[0] || null;
}

async function listarCategoria(categoriaId) {
  const id = idPositivo(categoriaId);
  if (!id) return [];
  const [linhas] = await pool.query('SELECT * FROM produto WHERE categoria_id = ? ORDER BY id', [id]);
  return linhas;
}

async function buscarPorNome(nome) {
  const [linhas] = await pool.query(
    'SELECT * FROM produto WHERE nome LIKE ? ORDER BY id',
    [`%${String(nome).trim()}%`]
  );
  return linhas;
}

async function inserir(produto) {
  const categoriaId = idPositivo(produto.categoria_id);
  if (!categoriaId) throw new ErroDeNegocio('Categoria não encontrada', 404);
  const [categorias] = await pool.query('SELECT id FROM categoria WHERE id = ?', [categoriaId]);
  if (!categorias.length) throw new ErroDeNegocio('Categoria não encontrada', 404);

  const { nome, descricao, preco, estoque, imagem_url } = produto;
  const [resultado] = await pool.query(
    `INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem_url)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [categoriaId, nome, descricao || null, preco, estoque, imagem_url || null]
  );
  return resultado.insertId;
}

async function atualizar(id, produto) {
  const produtoId = idPositivo(id);
  if (!produtoId) return null;

  const categoriaId = idPositivo(produto.categoria_id);
  if (!categoriaId) throw new ErroDeNegocio('Categoria não encontrada', 404);
  const [categorias] = await pool.query('SELECT id FROM categoria WHERE id = ?', [categoriaId]);
  if (!categorias.length) throw new ErroDeNegocio('Categoria não encontrada', 404);

  const { nome, descricao, preco, estoque, imagem_url } = produto;
  const [resultado] = await pool.query(
    `UPDATE produto
     SET categoria_id = ?, nome = ?, descricao = ?, preco = ?, estoque = ?, imagem_url = ?
     WHERE id = ?`,
    [categoriaId, nome, descricao || null, preco, estoque, imagem_url || null, produtoId]
  );
  return resultado.affectedRows;
}

async function remover(id) {
  const produtoId = idPositivo(id);
  if (!produtoId) return null;

  const [itens] = await pool.query('SELECT id FROM item_pedido WHERE produto_id = ? LIMIT 1', [produtoId]);
  if (itens.length) {
    throw new ErroDeNegocio('Produto vinculado a pedido e não pode ser removido', 409);
  }

  const [resultado] = await pool.query('DELETE FROM produto WHERE id = ?', [produtoId]);
  return resultado.affectedRows;
}

module.exports = { listarTodos, buscarPorId, listarCategoria, buscarPorNome, inserir, atualizar, remover };
