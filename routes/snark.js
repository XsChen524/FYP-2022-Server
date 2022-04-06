var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.get('/', snarkController.index);

router.get('/result', snarkController.Result);

/**
 * @param {Integer} userId
 */
router.get('/result/start-snark', snarkController.RunSnark);

/**
 * Get userId, secStr, infoHash from redis
 * @param {Integer} userId
 */
router.get('/result/check-user-info', snarkController.CheckUserInfo);

/**
 * Check whether the proof has been generated
 * @param {Integer} userId
 */
router.get('/result/check-proof', snarkController.CheckProof);

/**
 * Check whether pass the verification
 * @param {Integer} userId
 */
router.get('/result/check-verification', snarkController.CheckVerification);

router.get('/store-secret-string', snarkController.StoreSecretStr);

router.post('/mobile-scan-qr', snarkController.MobileScanQr);

router.get('/check-scan-qr-code', snarkController.CheckScanQrCode);


//Testing URL
router.get('/test-snark', snarkController.TestSnark);

module.exports = router;