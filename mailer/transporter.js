const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ferfamania1501@gmail.com',
        pass: 'vugkqpyogqrqzkxg'
    }
});
module.exports = transporter;