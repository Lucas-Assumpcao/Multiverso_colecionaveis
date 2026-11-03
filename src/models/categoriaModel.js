const { Categoria } = require('./documentos');
const { idNumerico, serializar } = require('./mongoUtils');

async function listarTodos() {
  const categorias = await Categoria.find().sort({ id: 1 }).lean();
  return categorias.map(serializar);
}

async function buscarPorId(id) {
  const categoriaId = idNumerico(id);
  if (categoriaId === null) return null;

  return serializar(await Categoria.findOne({ id: categoriaId }).lean());
}

module.exports = { listarTodos, buscarPorId };
