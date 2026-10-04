const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');
const verificarToken = require('../middlewares/authMiddleware');

router.post('/', verificarToken, enderecoController.criar);

module.exports = router;