const express = require('express');
const app = express();
const cors = require('cors');
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});