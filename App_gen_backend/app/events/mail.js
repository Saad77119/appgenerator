const nodemailer = require("nodemailer");
const fs = require("fs");
const { success ,error } = require("../helpers/responseApi");
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/

exports.verificatiomail = async (verifyUrl,email)=> {
    try {
        const smtpTransport = nodemailer.createTransport({
            port: 465,               // true for 465, false for other ports
            host: "smtp.gmail.com",
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
            secure: true,
        });


        await fs.readFile('./app/public/emailtemplate/index.html', 'utf8', async (err,mailbody) => {
            if (err) {
                return console.log(err);
            }
            mailbody = mailbody.replace("{link}", verifyUrl);

            let mailOptions = {
                from : process.env.SMTP_USERNAME,
                to : email,
                subject : "Email Confirmation",
                html : mailbody
            }
            await smtpTransport.sendMail(mailOptions, function (err, response) {
                if (err) {
                    return error(err.message,400) ;

                } else {

                    return (success("email successfully  sent!!", response, 200));
                }
            });
        });


    }
    catch (err) {

        throw err;
    }
}