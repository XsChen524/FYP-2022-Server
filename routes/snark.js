var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.get('/', snarkController.index);

module.exports = router;