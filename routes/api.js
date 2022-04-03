var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.post('/mobile-scan-qr', snarkController.MobileScanQr);

module.exports = router;