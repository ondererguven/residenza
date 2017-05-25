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

          var messageText = 'Congratulations <b>' + userSaved.firstname + '!</b>\r\n' +
                            'Click on the link below to download the application <br>' +
                            config.baseUrl + config.apiUrl + '/here-there-will-be-the-redemption-code-for-the-application <br>' + 
                            'When the application will be installed, click on this link to login into the application <br>' +
                            config.iOSAppSchema + userSaved.username + '/' + userSaved.password;

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
