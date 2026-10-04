const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/', verificarToken, pedidoController.criar);
router.get('/', verificarToken, pedidoController.listar);
router.get('/:id', verificarToken, pedidoController.buscarPorId);


module.exports = router;