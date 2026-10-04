const enderecoModel = require('../models/enderecoModel');

async function criar(req, res) {
  try {
    const { cep, logradouro, numero, bairro, cidade, estado } = req.body;
    if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios' });
    }

    const id = await enderecoModel.inserir(req.clienteId, req.body);
    res.status(201).json({ id });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao salvar endereço' });
  }
}

module.exports = { criar };