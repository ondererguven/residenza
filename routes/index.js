var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res, next) {

  // var enzo = new User({ name: 'enzo', surname: 'antonino', image: 'image', room: 313 });
  // enzo.save(function (err) {
  //   if (err) return handleError(err);
  // })

  res.render('index', { title: 'Express' });
});

module.exports = router;
