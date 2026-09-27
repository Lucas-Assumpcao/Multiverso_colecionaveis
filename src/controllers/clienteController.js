const clienteService = require('../services/clienteService');

async function cadastrar(req, res) {
  try {
    const { nome, email, senha, cpf } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
    }

    const id = await clienteService.cadastrar({ nome, email, senha, cpf });
    res.status(201).json({ id, mensagem: 'Cliente cadastrado com sucesso' });

  } catch (erro) {
    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensagem: 'E-mail já cadastrado' });
    }

    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao cadastrar cliente' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios' });
    }

    const resultado = await clienteService.login(email, senha);
    res.json(resultado);

  } catch (erro) {
    if (erro.message === 'Credenciais inválidas') {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
}

module.exports = { cadastrar, login };