var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('mensa get');
});

router.post('/', function(req, res, next) {
    res.send('mensa post');
});

module.exports = router;