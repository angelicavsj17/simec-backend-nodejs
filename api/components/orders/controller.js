const bcrypt = require('bcrypt'); // crifrar contraseña
const TABLA = 'Pedidos';
const { verify } = require('../../../auth/index');
const { bufferToBlob, uploadBlob } = require('../../blob');
module.exports = function (injectedStore, InjectedstoreMariaDb) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function query(body, token) {
        let { id } = verify(token);
        let user = await store.query("user", { id })
        let recipts = await storeMariaDb.selector(TABLA, {
            select:
                `SELECT Pedidos.Diagnostico, Pedidos.FechaPedido,
                Pedidos.PedidoID
                ,AspNetUsers.Firstname, AspNetUsers.LastName ,AspNetUsers.especialidad
                FROM patients 
                INNER JOIN Pedidos ON patients.PatientID = Pedidos.PatientID
                INNER JOIN soap ON Patients.PatientID = SOAP.PatientID
                INNER JOIN AspNetUsers ON SOAP.CreadoPor = AspNetUsers.Id
                WHERE patients.CedulaIdentidad = '${user.cedula}'`
        })
        if (recipts.recordset.length > 0) {
            let reciptsArray = []
            for (let recipt of recipts.recordset) {
                let result = await store.query('result', { id: recipt.PedidoID })
                if (result) {
                    recipt.result = result
                }
                reciptsArray.push(recipt)
            }
            return reciptsArray;
        }
    }
    async function uploadOrderResult(body, file, token) {
        let ext = file.mimetype.split('/')[1]
        let { PedidoID } = body
        let { id } = verify(token);
        let user = await store.query("user", { id })
        if (ext === 'pdf') {
            let Pedido = await storeMariaDb.selector('Prescriptions', {
                select: `
                SELECT Pedidos.Diagnostico, Pedidos.FechaPedido,
                Pedidos.PedidoID ,AspNetUsers.Firstname, AspNetUsers.LastName ,
                AspNetUsers.especialidad,soap.soapID,soap.soapDate
                FROM patients 
                INNER JOIN Pedidos ON patients.PatientID = Pedidos.PatientID
                INNER JOIN soap ON Patients.PatientID = SOAP.PatientID
                INNER JOIN AspNetUsers ON SOAP.CreadoPor = AspNetUsers.Id
                WHERE patients.CedulaIdentidad ='${user.cedula}' 
                AND Pedidos.PedidoID = ${PedidoID}`
            })
            if (Pedido.recordset.length > 0) {
                let { soapID, PedidoID, soapDate } = Pedido.recordset[0];
                console.log({ soapID, PedidoID, soapDate })
                let buffer = file.buffer
                let length = buffer.length
                let resultID = await uploadBlob({ ext, data: buffer, length })
                let inv = await store.upsert('result', { id: PedidoID, soapID, soapDate: new Date(soapDate).toISOString().slice(0, 19).replace('T', ' '), cedula: `${user.cedula}`, Result: resultID })
                return { success: true }
            }
            else {
                return { success: false }
            }
        }
        else {
            return null
        }
    }
    return {
        query,
        uploadOrderResult
    };
};