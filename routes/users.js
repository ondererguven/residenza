var express = require('express');
var router = express.Router();
var User = require('../auth/auth').User;
var TmpUser = require('../auth/auth').TmpUser;
var oauth = require('../auth/oauth').oauth;
var permit = require('../auth/oauth').permit;
var mailTransporter = require('../mail').mailTransporter;



router.get('/', function(req, res, next) {
  
  User.find(function(err, users){
    res.status(200).json(users);
  });
  
});

router.post('/', 
  oauth.authorise(),
  permit('admin'),
  function(req, res){

    if (
      req.body.username == null || req.body.username == 'undefined' ||
      req.body.firstname == null || req.body.firstname == 'undefined' ||
      req.body.lastname == null || req.body.lastname == 'undefined' ||
      req.body.email == null || req.body.email == 'undefined' ||
      req.body.role == null || req.body.role == 'undefined') {
        res.status(500).json({
          err: true,
          message: "Check the mandatory fields"
        });
        return;
    }

    var user = new TmpUser(req.body);
    user.creationDate = new Date();
    user.verificationCode = "abcde";

    user.save().then(function(userSaved){

      // setup email data with unicode symbols
      var mailOptions = {
          from: 'ilprimoloprendi@gmail.com',
          to: userSaved.email,
          subject: 'Welcome to the residence platform!',
          text: 'Hello world ?',
          html: 'Hi <b>' + userSaved.firstname + '!</b>\r\n' +
                'Click on the link below to verify your account ' +
                'http://127.0.0.1:3000/users/verify/' + userSaved.verificationCode
      };

      // send mail with defined transport object
      mailTransporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Message %s sent: %s', info.messageId, info.response);
          }
      });

      res.status(200).json({
        err: false,
        message: "DONE"
      });
    }).catch(function(error){
      res.status(500).json({
        err: true, 
        message: error
      });
    });

});

router.get('/verify/:verificationCode', function(req, res){
  var code = req.params.verificationCode;
  console.log("Finding the verification code: " + code);
  TmpUser.findOneAndRemove({verificationCode: code}, function(err, tmpUser){
    if (err){
      console.error("VerificationCode not found");
      res.status(500).json({
        err: true,
        message: "verificationCodeNotFound"
      });
    } else {
      console.log("verification code found");
      //check the date

      //create OAuthUser
      var user = new User({
        username: tmpUser.username,
        password: "AKDSJFLKSDAJFLòKASDKASDJFòKLASDFJ",
        firstname: tmpUser.firstname,
        lastname: tmpUser.lastname,
        email: tmpUser.email,
        role: tmpUser.role
      });
      user.save(function(err, userSaved){
        if (err) {
          console.error("User not created");
          res.status(500).json({
            err: true,
            message: "error saving new user!"
          });
        } else {
          console.log("user succefully created");
          res.status(200).json({
            err: false,
            message: "DONE"
          });
        }
      });
    }
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
