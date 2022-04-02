var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.get('/', snarkController.index);

router.get('/store-secret-string', snarkController.StoreSecretStr);

module.exports = router;