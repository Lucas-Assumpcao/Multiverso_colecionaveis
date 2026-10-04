const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verificarAdmin = require('../middlewares/verificarAdmin');
const pedidoController = require('../controllers/pedidoController');

router.get('/pedidos', verificarAdmin, pedidoController.listarAdmin);
router.put('/pedidos/:id/status', verificarAdmin, pedidoController.atualizarStatus);
router.post('/login', adminController.login);

module.exports = router;