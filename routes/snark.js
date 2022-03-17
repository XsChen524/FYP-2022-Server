var express = require('express');
var snarkController = require('../controllers/snark/SnarkController');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('This is snark!');
});

module.exports = router;