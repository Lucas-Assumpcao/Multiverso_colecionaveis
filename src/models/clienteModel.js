const { Cliente } = require('./documentos');
const { proximoId } = require('./contadorModel');
const { serializar } = require('./mongoUtils');

async function inserir(cliente) {
  const novoCliente = await Cliente.create({
    ...cliente,
    email: String(cliente.email).trim().toLowerCase(),
    id: await proximoId('clientes'),
  });
  return novoCliente.id;
}

async function buscarPorEmail(email) {
  return serializar(await Cliente.findOne({
    email: String(email).trim().toLowerCase(),
  }).lean());
}

module.exports = { inserir, buscarPorEmail };
