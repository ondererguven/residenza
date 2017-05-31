var express = require('express');
var router = express.Router();
var User = require('../auth/auth').User;
var TmpUser = require('../auth/auth').TmpUser;
var oauth = require('../auth/oauth').oauth;
var permit = require('../auth/oauth').permit;
var mailTransporter = require('../mail').mailTransporter;
var config = require('../config/config');
var utils = require('../utils');


router.get('/', 
  oauth.authorise(),
  permit('admin'),
  function(req, res, next) {
  
    User.find(function(err, users){
      res.status(200).json({
        err: false,
        data: users
      });
    }); 
  }
);

router.get('/tmp-users', 
  oauth.authorise(),
  permit('admin'),
  function(req, res, next) {
  
    TmpUser.find(function(err, users){
      res.status(200).json({
        err: false,
        data: users
      });
    }); 
  }
);

router.get('/drivers', 
  function(req, res, next) {
  
    User.find({ role: 'driver' },function(err, drivers){
      res.status(200).json({
        err: false,
        data: drivers
      });
    }); 
  }
);

router.get('/:userId', 
  oauth.authorise(),
  permit('admin'),
  function(req, res, next) {
    User.findById(req.params.userId, function(err, user){
      if (err) {
        res.status(500).json({
          err: true,
          data: err
        });
      }
      res.status(200).json({
        err: false,
        data: user
      });
    }); 
  }
);

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
    user.verificationCode = utils.uid(256);

    user.save().then(function(userSaved){

      // setup email data with unicode symbols
      var mailOptions = {
          from: 'ilprimoloprendi@gmail.com',
          to: userSaved.email,
          subject: 'You are almost there...',
          html: 'Hi <b>' + userSaved.firstname + '!</b>\r\n' +
                'Click on the link below to verify your account in the Residenz\'m platform <br>' +
                config.baseUrl + config.apiUrl + '/users/verify/' + userSaved.verificationCode
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
  }
);

router.put('/', 
  oauth.authorise(),
  permit('admin'),
  function(req, res) {

    if (
      req.body._id == null || req.body._id == 'undefined' ||
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

    User.findById(req.body._id, function(err, user){
      if (err) {
        res.status(500).json({
          err: true, 
          message: err
        });
      } else {
        user.username = req.body.username;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.email = req.body.email;
        user.role = req.body.role;
        user.room = req.body.room;
        user.modificationDate = new Date();
        user.save().then(function(userSaved){
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
      }
    });
  }
);

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
        password: utils.uid(128),
        firstname: tmpUser.firstname,
        lastname: tmpUser.lastname,
        email: tmpUser.email,
        role: tmpUser.role, 
        creationDate: new Date()
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

          var messageText = 'Congratulations <b>' + userSaved.firstname + '!</b>\r\n\r\n' +
                            'Click on <a href="' + config.iOSAppSchema + userSaved.username + '/' + userSaved.password + '">this link</a> to login into the application.';

          var mailOptions = {};
          mailOptions.from = 'ilprimoloprendi@gmail.com';
          mailOptions.to = userSaved.email;
          mailOptions.subject = 'Welcome to the residence platform!';
          mailOptions.text = messageText;
          mailOptions.html = messageText;

          mailTransporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Message %s sent: %s', info.messageId, info.response);
              }
          });
          
          res.render('userVerified', { 
            title: 'Congratulations!', 
            platform: "Residenz'm", 
            message: "You will receive an email with the information to download the iOS application. Please open the email from your iPhone to enjoy the best experience." ,
            endMessage: "See you great magicians!"
          });
        }
      });
    }
  });

});


/*
router.get('/create/admin-user', function(req, res){
  var user = new User({
    username: "bla@bla.com",
    password: "bla",
    email: "bla@bla.com",
    role: "admin",
    isActive: true
  });

  user.save().then(function(userSaved){
    res.status(200).json(userSaved);
  });
});
*/

module.exports = router;
