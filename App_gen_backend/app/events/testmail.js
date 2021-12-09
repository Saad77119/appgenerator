var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: 'saadraza.official@gmail.com',
        pass: '12unique@123',
    },
    secure: true,
});
const mailData = {
    from: 'saadraza.official@gmail.com',  // sender address
    to: 'bitf18a038@pucit.edu.pk',   // list of receivers
    subject: 'Sending Email using Node.js',
    text: 'That was easy!',
    html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
};
transporter.sendMail(mailData, function (err, info) {
    if(err)
        console.log(err)
    else
        console.log(info);
});
