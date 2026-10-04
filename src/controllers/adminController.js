const adminService = require('../services/adminService');

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'E-mail e senha são obrigatórios' });
    }
    const resultado = await adminService.login(email, senha);
    res.json(resultado);
  } catch (erro) {
    if (erro.message === 'Credenciais inválidas') {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
}

module.exports = { login };