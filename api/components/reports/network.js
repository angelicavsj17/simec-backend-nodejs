const express = require('express');
const { verify } = require('../../../auth');
const response = require('../../../network/response');
const Controller = require('./index');
const router = express.Router();
router.get('/pedido/:id/:date', function (req, res, next) {
    let token = req.headers.authorization;
    let { date, id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.pedidos(req.body, token, userD, date, id)
                .then(out => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
                .catch(() => res.status(500).json({ error: true }));
    }
})
router.get('/pedido/:id', function (req, res, next) {
    let token = req.headers.authorization;
    let { id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.pedidosById(req.body, token, userD, id)
                .then(out => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
                .catch(() => res.status(500).json({ error: true }));
    }
})
router.get('/Receta/:id/:date', async function (req, res, next) {
    let token = req.headers.authorization;
    let { date, id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.recetas(req.body, token, userD, date, id)
                .then(out => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
                .catch(() => res.status(500).json({ error: true }));
    }
})
router.get('/Receta/:id', async function (req, res, next) {
    let token = req.headers.authorization;
    let { id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.recetasById(req.body, token, userD, id)
                .then(out => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
                .catch(() => res.status(500).json({ error: true }));
    }
})
router.get('/Certificado/:id/:date', async function (req, res, next) {
    let token = req.headers.authorization;
    let { date, id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.certificados(req.body, token, userD, date, id)
                .then(out => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
                .catch(() => res.status(500).json({ error: true }))
    }
})
router.get('/Facturas/:id/:date', async function (req, res, next) {
    let token = req.headers.authorization;
    let { date, id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.facturas(req.body, token, userD, date, id)
                .then((out) => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
    }
})
router.get('/Facturas/:id', async function (req, res, next) {
    let token = req.headers.authorization;
    let { id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.facturasById(req.body, token, userD, id)
                .then((out) => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
    }
})
router.get('/Resultado/:id', async function (req, res, next) {
    let token = req.headers.authorization;
    let { id } = req.params
    if (token) {
        let userD = verify(token);
        if (userD)
            Controller.resultadoById(req.body, token, userD, id)
                .then((out) => {
                    if (out) {
                        out.pipe(res)
                    }
                    else { res.status(500).json({ error: true }) }
                })
    }
})
module.exports = router;