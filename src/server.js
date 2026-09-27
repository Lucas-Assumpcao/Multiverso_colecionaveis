const express = require('express');
const app = express();
const categoriaRoutes = require('./routes/categoriaRoutes');

app.use('/categorias', categoriaRoutes);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'API no ar' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

const produtoRoutes = require('./routes/produtoRoutes');
app.use('/produtos', produtoRoutes);