const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');
const sendMail = require('../../../mailer/sendmail')
//router

const router = express.Router();

router.post('/login', function (req, res, next) {
    Controller.login(req.body.username, req.body.password)
        .then(token => {
            response.success(req, res, token, 200);
        })
        .catch(next);
})
router.post("/recover", function (req, res, next) {
    let { username, email, url } = req.body;
    Controller.recover(username, email).then((data) => {
        if (!data.error) {
            if (data) {
                sendMail(data.correo, username, url)
                response.success(req, res, { state: "OK" }, 200)
            }
            else {
                response.error(req, res, { error: { msg: 'EL usuario o correo no es correcto' } }, 200)
            }
        }
        else {
            response.error(req, res, { error: { msg: 'EL usuario o correo no es correcto' } }, 200)
        }
    }).catch((e) => { response.error(req, res, { error: { msg: 'EL usuario o correo no es correcto' } }, 200) });
})
router.post("/restore", function (req, res, next) {
    let { token } = req.query;
    let { password, repeatPassword } = req.body
    Controller.restore({ password, repeatPassword, token }).then((data) => {
        if (!data.error)
            response.success(req, res, { state: "OK" }, 200)
        else {
            response.error(req, res, { error: { msg: data.error.msg } }, 200)
        }
    })
})
module.exports = router;