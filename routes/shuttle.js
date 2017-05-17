var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('shuttle get');
});

router.post('/', function(req, res, next) {
    res.send('shuttle post');
});

router.post('/1', function(req, res, next) {
    res.send('shuttle 111111');
});

module.exports = router;