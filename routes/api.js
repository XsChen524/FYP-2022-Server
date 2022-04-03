var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.get('/mobile-scan-qr', snarkController.MobileScanQr);

module.exports = router;