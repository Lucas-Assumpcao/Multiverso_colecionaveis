const clienteModel = require('../models/clienteModel');
const bcrypt = require('bcrypt');

async function cadastrar(dadosCliente) {
    const { nome, email, senha, cpf } = dadosCliente;

    const hash = await bcrypt.hash(senha, 10);
    return await clienteModel.inserir({ nome, email, senha_hash: hash, cpf });
};

module.exports = { cadastrar };