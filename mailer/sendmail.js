const { signPasswordToken } = require("../auth");
const transporter = require("./transporter");

let sendMail = (to, username, url) => {
    let token = signPasswordToken({ username })
    var mailOptions = {
        from: 'ferfamania1501@gmail.com',
        to: to,
        subject: 'Recuperar contraseña',
        text: `Recuperar contraseña http://${url}/auth/restore?token=${token}`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // res.send(500, err.message);
        } else {
            // res.status(200).jsonp(req.body);
        }
    });
}
module.exports = sendMail