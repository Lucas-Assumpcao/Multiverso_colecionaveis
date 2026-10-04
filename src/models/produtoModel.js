const pool = require('../config/db');

async function listarTodos() {
  const [linhas] = await pool.query('SELECT * FROM produto');
  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await pool.query('SELECT * FROM produto WHERE id = ?', [id]);
  return linhas[0];
}

async function listarCategoria(categoria_id) {
  const [linhas] = await pool.query('SELECT * FROM produto WHERE categoria_id = ?', [categoria_id]);
  return linhas;
}

async function buscarPorNome(nome) {
  const [linhas] = await pool.query(
    'SELECT * FROM produto WHERE nome LIKE ?',
    [`%${nome}%`]
  );
  return linhas;
}
async function inserir(produto) {
  const { categoria_id, nome, descricao, preco, estoque, imagem_url } = produto;
  const [resultado] = await pool.query(
    'INSERT INTO produto (categoria_id, nome, descricao, preco, estoque, imagem_url) VALUES (?, ?, ?, ?, ?, ?)',
    [categoria_id, nome, descricao, preco, estoque, imagem_url || null]
  );
  return resultado.insertId;
}

async function atualizar(id, produto) {
  const { categoria_id, nome, descricao, preco, estoque, imagem_url } = produto;
  await pool.query(
    'UPDATE produto SET categoria_id=?, nome=?, descricao=?, preco=?, estoque=?, imagem_url=? WHERE id=?',
    [categoria_id, nome, descricao, preco, estoque, imagem_url || null, id]
  );
}

async function remover(id) {
  await pool.query('DELETE FROM produto WHERE id = ?', [id]);
}

module.exports = { listarTodos, buscarPorId, listarCategoria, buscarPorNome, inserir, atualizar, remover };