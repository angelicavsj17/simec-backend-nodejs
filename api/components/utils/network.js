const express = require('express');
const response = require('../../../network/response');
const Controller = require('./index');

const router = express.Router();

router.get('/cities', function (req, res, next) {
    Controller.getCities(req.body)
        .then(rest => {
            response.success(req, res, rest, 200);
        })
        .catch(next);
})
router.get('/specialities', function (req, res, next) {
    Controller.getSpecialities(req.body)
        .then(rest => {
            response.success(req, res, rest, 200);
        })
        .catch(next);
})
module.exports = router;