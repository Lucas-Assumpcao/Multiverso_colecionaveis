if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const { conectarBanco, pool } = require('./config/db');
const enderecoRoutes = require('./routes/enderecoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

const origensPermitidas = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origem) => origem.trim())
  .filter(Boolean);
app.use(cors({
  origin(origem, callback) {
    if (!origem || origensPermitidas.includes(origem)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS'));
  },
}));
app.use(express.json());  // ← primeiro de tudo, antes das rotas
app.use('/enderecos', enderecoRoutes);
app.use('/admin', adminRoutes);
app.use('/pagamentos', pagamentoRoutes);
app.use('/webhooks', webhookRoutes);

const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const authRoutes = require('./routes/authRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');


app.use('/pedidos', pedidoRoutes);
app.use('/login', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'API no ar' });
});

async function iniciarServidor() {
  await conectarBanco();
  const porta = process.env.PORT || 3000;
  const servidor = app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
  });

  return servidor;
}

if (require.main === module) {
  iniciarServidor().catch(async (erro) => {
    console.error('Não foi possível iniciar a API:', erro);
    await pool.end();
    process.exitCode = 1;
  });
}

module.exports = app;
