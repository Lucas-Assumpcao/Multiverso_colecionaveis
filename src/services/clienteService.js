const clienteModel = require('../models/clienteModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function cadastrar(dadosCliente) {
    const { nome, email, senha, cpf } = dadosCliente;

    const hash = await bcrypt.hash(senha, 10);
    return await clienteModel.inserir({ nome, email, senha_hash: hash, cpf });
};

async function login(email, senha) {
    const cliente = await clienteModel.buscarPorEmail(email);
    if (!cliente) {
        throw new Error('Credenciais inválidas');
    }
    const isMatch = await bcrypt.compare(senha, cliente.senha_hash);
    if (!isMatch) {
        throw new Error('Credenciais inválidas');
    }
    const token = jwt.sign({ id: cliente.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const { senha_hash, ...clienteSemSenha } = cliente;
    return { ...clienteSemSenha, token };
}

module.exports = { cadastrar, login };