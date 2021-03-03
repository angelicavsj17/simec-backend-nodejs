const { downloadBlob, bufferToStream } = require('../../blob');
const pdfModels = require('../../utils/pdfModels/index');
const querys = require("./querys");
module.exports = function (injectedStore, InjectedstoreMariaDb, Injectedclient) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb;
    let client = Injectedclient;
    if (!store) {
        store = require('../../../store/dummy');
    }
    async function pedidos(body, token, userD, date, id) {
        let { cedula } = await store.query("user", { id: userD.id })
        return new Promise(async (resolve, reject) => {
            let Pedidos = await storeMariaDb.selector('Pedidos', {
                select: querys.Pedidos(cedula, date, id)
            })
            if (Pedidos.recordset) {
                if (Pedidos.recordset.length > 0) {
                    let products = await storeMariaDb.selector('DetallePedido', {
                        select: querys.DetallesPedido(Pedidos.recordset[0].PedidoID)
                    })
                    client.render({
                        template: {
                            'shortid': 'Sys1nkpa-',
                            engine: 'handlebars',
                        },
                        data: pdfModels.pedido(Pedidos.recordset[0], products.recordset),
                    }).then((out) => {
                        if (out)
                            resolve(out)
                    }).catch((e) => {
                        reject(e)
                    });
                }
                else reject()
            }
            else reject()
        }
        )
    }
    async function pedidosById(body, token, userD, id) {
        let { cedula } = await store.query("user", { id: userD.id })
        return new Promise(async (resolve, reject) => {
            let Pedidos = await storeMariaDb.selector('Pedidos', {
                select: querys.PedidosById(cedula, id)
            })
            if (Pedidos.recordset) {
                if (Pedidos.recordset.length > 0) {
                    let products = await storeMariaDb.selector('DetallePedido', {
                        select: querys.DetallesPedido(Pedidos.recordset[0].PedidoID)
                    })
                    client.render({
                        template: {
                            'shortid': 'Sys1nkpa-',
                            engine: 'handlebars',
                        },
                        data: pdfModels.pedido(Pedidos.recordset[0], products.recordset),
                    }).then((out) => {
                        if (out)
                            resolve(out)
                    }).catch((e) => {
                        reject(e)
                    });
                }
                else reject()
            }
            else reject()
        }
        )
    }
    async function recetas(body, token, userD, date, id) {
        let { cedula } = await store.query("user", { id: userD.id })
        return new Promise(async (resolve, reject) => {
            let Prescriptions = await storeMariaDb.selector('Prescriptions', {
                select: querys.Recetas(cedula, date, id)
            })
            if (Prescriptions.recordset) {
                if (Prescriptions.recordset.length > 0) {
                    let recipes = await storeMariaDb.selector('DetallePedido', {
                        select: querys.DetallesReceta(Prescriptions.recordset[0].PrescriptionID)
                    })
                    client.render({
                        template: {
                            'shortid': 'SJvooxTa-',
                            engine: 'handlebars',
                        },
                        data: pdfModels.recetas(Prescriptions.recordset[0], recipes.recordset),
                    }).then((out) => {
                        // console.log(out, 'this is out')
                        if (out)
                            resolve(out)
                    }).catch((e) => {
                        reject(e)
                    });
                }
                else return reject()
            }
            else return reject()
        }
        )
    }
    async function recetasById(body, token, userD, id) {
        let { cedula } = await store.query("user", { id: userD.id })
        return new Promise(async (resolve, reject) => {
            let Prescriptions = await storeMariaDb.selector('Prescriptions', {
                select: querys.RecetasById(cedula, id)
            })
            if (Prescriptions.recordset) {
                if (Prescriptions.recordset.length > 0) {
                    let recipes = await storeMariaDb.selector('DetallePedido', {
                        select: querys.DetallesReceta(Prescriptions.recordset[0].PrescriptionID)
                    })
                    client.render({
                        template: {
                            'shortid': 'SJvooxTa-',
                            engine: 'handlebars',
                        },
                        data: pdfModels.recetas(Prescriptions.recordset[0], recipes.recordset),
                    }).then((out) => {
                        if (out)
                            resolve(out)
                    }).catch((e) => {
                        reject(e)
                    });
                }
                else return reject()
            }
            else return reject()
        }
        )
    }
    async function certificados(body, token, userD, date, id) {
        let { cedula } = await store.query("user", { id: userD.id })
        return new Promise(async (resolve, reject) => {
            let certificados = await storeMariaDb.selector('Certificados', {
                select: querys.Certificado(cedula, date, id)
            })
            if (certificados.recordset) {
                if (certificados.recordset.length > 0) {
                    client.render({
                        template: {
                            'shortid': 'rkWq9kTT-',
                            engine: 'handlebars',
                        },
                        data: pdfModels.certificados(certificados.recordset[0]),
                    }).then((out) => {
                        if (out)
                            resolve(out)
                    }).catch((e) => {
                        reject(e)
                    });
                }
                else return reject()
            }
            else return reject()
        })
    }
    let facturas = async (body, token, userD, date, id) => {
        // let { cedula } = await store.query("user", { id: userD.id })
        return new Promise(async (resolve, reject) => {
            let result = await store.query('Invoid', { soapID: id })
            if (result) {
                let pdf = await downloadBlob(result.Factura);
                let stream = bufferToStream(pdf)
                resolve(stream)
            }
            else {
                return reject(null)
            }
        })
    }
    let facturasById = (body, token, userD, id) => {
        return new Promise(async (resolve, reject) => {
            let result = await store.query('Invoid', { id: id })
            if (result) {
                let pdf = await downloadBlob(result.Factura);
                let stream = bufferToStream(pdf)
                resolve(stream)
            }
            else {
                return reject(null)
            }
        })
    }
    let resultadoById = (body, token, userD, id) => {
        return new Promise(async (resolve, reject) => {
            let result = await store.query('result', { id: id })
            if (result) {
                let pdf = await downloadBlob(result.Result);
                let stream = bufferToStream(pdf)
                resolve(stream)
            }
            else {
                return reject(null)
            }
        })
    }
    return {
        pedidos,
        recetas,
        certificados,
        pedidosById,
        recetasById,
        facturas,
        facturasById,
        resultadoById
    };
};