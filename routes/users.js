var express = require('express');
var router = express.Router();
var User = require('../auth/auth').User;

router.get('/', function(req, res, next) {
  
  User.find(function(err, users){
    res.status(200).json(users);
  });
  
});

/*
router.get('/create-admin-user', function(req, res){
  var user = new User({
    username: "bla",
    password: "bla",
    role: "admin"
  });

  user.save().then(function(userSaved){
    res.status(200).json(userSaved);
  });
});
*/

module.exports = router;
