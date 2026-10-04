const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/:pedidoId', verificarToken, pagamentoController.criar);

module.exports = router;