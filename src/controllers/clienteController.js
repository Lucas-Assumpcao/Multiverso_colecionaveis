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

module.exports = { cadastrar };