var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('laundry get');
});

module.exports = router;