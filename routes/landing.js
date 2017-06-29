var express = require('express');
var router = express.Router();
var mailTransporter = require('../mail').mailTransporter;



var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emailSchema = new Schema({
    date: Date,
    email: {type: String,  required: true, index: { unique: true }},
    type: String
});

var Email = mongoose.model('Email', emailSchema);



router.post('/', 
  function(req, res){

    if (!req.body.email || !req.body.type){
        res.status(500).json({
          err: true,
          message: "Check the mandatory fields"
        });
        return;
    }

    var email = new Email();
    email.date = new Date();
    email.email = req.body.email;
    email.type = req.body.type;

    email.save().then(function(emailSaved) {

    //   setup email data with unicode symbols
    //   var mailOptions = {
    //       from: 'ilprimoloprendi@gmail.com',
    //       to: userSaved.email,
    //       subject: 'Email inserted',
    //       html: 'Hi <b>' + userSaved.firstname + '!</b>\r\n' +
    //             'Click on the link below to verify your account in the Residenz\'m platform <br>' +
    //             config.baseUrl + config.apiUrl + '/users/verify/' + userSaved.verificationCode
    //   };

    //   // send mail with defined transport object
    //   mailTransporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Message %s sent: %s', info.messageId, info.response);
    //       }
    //   });

      res.status(200).json({
        err: false,
        message: "DONE"
      });
    }).catch(function(error){
        if (error.code == 11000) {
            res.status(400).json({
                err: true, 
                message: "Email already inserted!"
            });
            return;
        } else {
            res.status(500).json({
                err: true, 
                message: error
            });
            return;
        }
    });
  }
);


module.exports = router;
