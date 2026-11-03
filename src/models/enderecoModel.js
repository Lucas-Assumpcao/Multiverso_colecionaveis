const { Endereco } = require('./documentos');
const { proximoId } = require('./contadorModel');
const { idNumerico } = require('./mongoUtils');

async function inserir(clienteId, dados) {
  const endereco = await Endereco.create({
    ...dados,
    cliente_id: clienteId,
    complemento: dados.complemento || null,
    id: await proximoId('enderecos'),
  });
  return endereco.id;
}

async function pertenceAoCliente(id, clienteId) {
  const enderecoId = idNumerico(id);
  const cliente = idNumerico(clienteId);
  if (enderecoId === null || cliente === null) return false;

  return Boolean(await Endereco.exists({ id: enderecoId, cliente_id: cliente }));
}

module.exports = { inserir, pertenceAoCliente };
