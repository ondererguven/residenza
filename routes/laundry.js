var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('laundry get');
});

router.post('/', function(req, res, next) {
    res.send('laundry post');
});

module.exports = router;