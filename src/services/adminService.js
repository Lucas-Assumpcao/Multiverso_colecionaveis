const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

async function login(email, senha) {
  const admin = await adminModel.buscarPorEmail(email);
  if (!admin) throw new Error('Credenciais inválidas');

  const confere = await bcrypt.compare(senha, admin.senha_hash);
  if (!confere) throw new Error('Credenciais inválidas');

  const token = jwt.sign({ id: admin.id, tipo: 'admin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
  return { id: admin.id, nome: admin.nome, token };
}

module.exports = { login };