const { Contador } = require('./documentos');

async function proximoId(nome) {
  let contador;
  for (let tentativa = 0; tentativa < 3; tentativa += 1) {
    try {
      contador = await Contador.findOneAndUpdate(
        { nome },
        { $inc: { sequencia: 1 } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();
      break;
    } catch (erro) {
      if (erro.code !== 11000 || tentativa === 2) throw erro;
    }
  }

  return contador.sequencia;
}

module.exports = { proximoId };
