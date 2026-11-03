const { UsuarioAdmin } = require('./documentos');
const { serializar } = require('./mongoUtils');

async function buscarPorEmail(email) {
  return serializar(await UsuarioAdmin.findOne({
    email: String(email).trim().toLowerCase(),
  }).lean());
}

module.exports = { buscarPorEmail };
