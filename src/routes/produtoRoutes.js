const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.get('/categoria/:categoria', produtoController.listarProdutosPorCategoria);
module.exports = router;