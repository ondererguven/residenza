var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('menu get');
});

module.exports = router;