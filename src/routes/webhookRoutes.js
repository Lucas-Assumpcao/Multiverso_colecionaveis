const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/mercadopago', webhookController.mercadoPago);

module.exports = router;