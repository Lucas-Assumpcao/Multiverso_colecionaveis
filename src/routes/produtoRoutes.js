const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const verificarAdmin = require('../middlewares/verificarAdmin');

router.post('/', verificarAdmin, produtoController.criar);
router.put('/:id', verificarAdmin, produtoController.atualizar);
router.delete('/:id', verificarAdmin, produtoController.remover);
router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.get('/categoria/:categoria', produtoController.listarProdutosPorCategoria);
module.exports = router;