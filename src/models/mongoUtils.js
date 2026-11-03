function idNumerico(valor) {
  const id = Number(valor);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function serializar(documento) {
  if (!documento) return documento;
  const dados = typeof documento.toObject === 'function'
    ? documento.toObject()
    : { ...documento };

  delete dados._id;
  delete dados.__v;
  return dados;
}

module.exports = { idNumerico, serializar };
