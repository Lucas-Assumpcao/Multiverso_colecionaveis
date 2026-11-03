const express = require('express');
const app = express();
const cors = require('cors');
const { conectarBanco, mongoose } = require('./config/db');
const enderecoRoutes = require('./routes/enderecoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pagamentoRoutes = require('./routes/pagamentoRoutes');
const webhookRoutes = require('./routes/webhookRoutes');

app.use(cors());
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
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}

module.exports = { app, iniciarServidor };