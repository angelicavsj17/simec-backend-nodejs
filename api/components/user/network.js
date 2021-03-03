//parte red componente user
const express = require('express');
const { validationResult } = require('express-validator');
const response = require('../../../network/response');
const validators = require('../../validators');
const Controller = require('./index');
const secure = require('./secure')

//router
const router = express.Router();

// Routes
router.get('/', list)
router.get('/:id', get);
router.post('/', validators.userValidation, upsert);
router.put('/', secure('update'), upsert);
// Internal functions
function list(req, res, next) {
    Controller.list()
        .then((lista) => {
            response.success(req, res, lista, 200);
        })
        .catch((e) => { console.log(e) });
}

function get(req, res, next) {
    Controller.get(req.params.id)
        .then((user) => {
            response.success(req, res, user, 200);
        })
        .catch(next);
}

function upsert(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        Controller.upsert(req.body)
            .then((user) => {
                if (user) {
                    response.success(req, res, user, 201);
                }
                else {
                    response.error(req, res, { error: { msg: "Este cedula no esta registrado en bmi" } }, 200)
                }
            })
            .catch((err) => { response.error(req, res); console.log(err, "this is error") });
    }
    else {
        let error = errors.array()
        response.error(req, res, { error: error[0] }, 200)
    }
}

module.exports = router;