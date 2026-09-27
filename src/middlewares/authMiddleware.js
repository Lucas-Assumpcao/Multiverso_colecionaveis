const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // separa "Bearer" do token em si

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.clienteId = payload.id; // disponibiliza pro controller usar depois
    next(); // deixa a requisição seguir pro controller de verdade
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
}

module.exports = verificarToken;