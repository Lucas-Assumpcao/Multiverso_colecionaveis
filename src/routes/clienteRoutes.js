const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.post('/', clienteController.cadastrar);
router.post('/login', clienteController.login);

module.exports = router;