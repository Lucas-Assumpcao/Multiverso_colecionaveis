const categoriaModel = require('../models/categoriaModel');

async function listarCategorias() {
  return await categoriaModel.listarTodos();
}

async function buscarPorId(id) {
  return await categoriaModel.buscarPorId(id);
}


module.exports = { listarCategorias, buscarPorId };