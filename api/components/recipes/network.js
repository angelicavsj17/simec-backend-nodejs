const express = require('express');
const response = require('../../../network/response');
const { multerBlob } = require('../../utils/multer');
const Controller = require('./index');

const router = express.Router();

router.get('/get', function (req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        Controller.query(req.body, token)
            .then(rest => {
                response.success(req, res, rest, 200);
            })
            .catch(next);
    }
})
router.post('/upload/invoid', multerBlob.single('pdf'), function (req, res, next) {
    let token = req.headers.authorization;
    console.log(req.body)
    if (token) {
        Controller.uploadInvoid(req.body, req.file, token)
            .then(rest => {
                response.success(req, res, rest, 200);
            })
            .catch(next);
    }
})
module.exports = router;