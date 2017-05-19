var express = require('express');
var router = express.Router();
var User = require('../auth').User;

router.get('/', function(req, res, next) {
  
  User.find(function(err, users){
    res.status(200).json(users);
  });
  
});

module.exports = router;
