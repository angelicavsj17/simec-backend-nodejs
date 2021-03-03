const express = require('express');
const response = require('../network/response');
const Store = require('../store/mysql');

const router = express.Router();

//creamos una funcion para cada tabla

router.get('/:table', list);
router.get('/:table/:id', get);
router.post('/:table', insert);
router.post('/:table/query', query);
router.put('/:table', upsert);

//peticiones directas contra la base de datos  
async function list(req, res, next) {
    const datos = await Store.list(req.params.table)
    response.success(req, res, datos, 200);
};

async function get(req, res, next) {
    const datos = await Store.get(req.params.table, req.params.id)
    response.success(req, res, datos, 200);
};

async function insert(req, res, next) {
    try {
        const datos = await Store.insert(req.params.table, req.body)
        response.success(req, res, datos, 200);
    } catch {
        response.error(req, res, { error: true, message: "Error con la base de datos" });
    }
};

async function upsert(req, res, next) {
    try {
        const datos = await Store.upsert(req.params.table, req.body)
        response.success(req, res, datos, 200);
    } catch {
        response.error(req, res, { error: true, message: "Error con la base de datos" });
    }
};
async function query(req, res, next) {
    try {
        const datos = await Store.query(req.params.table, req.body);
        response.success(req, res, datos, 200);
    } catch {
        response.error(req, res, { error: true, message: "Error con la base de datos" });
    }
}
module.exports = router;