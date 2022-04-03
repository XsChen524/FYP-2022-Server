var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.get('/', snarkController.index);

router.get('/result', snarkController.Result);

router.get('/store-secret-string', snarkController.StoreSecretStr);

router.get('/mobile-scan-qr', snarkController.MobileScanQr);

router.get('/check-scan-qr-code', snarkController.CheckScanQrCode);

module.exports = router;