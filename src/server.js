const express = require('express');
const app = express();

app.use(express.json());  // ← primeiro de tudo, antes das rotas

const categoriaRoutes = require('./routes/categoriaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const authRoutes = require('./routes/authRoutes');

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