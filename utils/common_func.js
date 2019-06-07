const nodemailer = require('nodemailer');

module.exports = {
    generateGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    sendEmail: function (from, to, subject, text, html){
        var transporter =  nodemailer.createTransport({ // config mail server
            service: 'Gmail',
            auth: {
                user: 'htphong.2812@gmail.com',
                pass: 'Bratlove12#'
            }
        });
        var mainOptions = {
            from: from,
            to: to,
            subject: subject,
            text: text,
            html: html
        }
        transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
            }
        });
    }
}