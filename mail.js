var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ilprimoloprendi@gmail.com',
        pass: 'IlPrimoLoPrendi-17'
    }
});

// var mailOptions = {
//     from: 'ilprimoloprendi@gmail.com', // sender address
//     to: 'lucacarmisciano@gmail.com', // list of receivers
//     subject: 'Hello ✔', // Subject line
//     text: 'Hello world ?', // plain text body
//     html: '<b>Hello world ?</b>' // html body
// };

module.exports.mailTransporter = transporter;