
const bcrypt = require('bcrypt'); // crifrar contraseña
const TABLA = 'Prescriptions';
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
                `SELECT Prescriptions.PrescriptionAlergias, Prescriptions.Diagnostico,
                Prescriptions.PrescriptionDate,Prescriptions.PrescriptionID
                ,AspNetUsers.Firstname ,AspNetUsers.especialidad
                FROM patients 
                inner JOIN Prescriptions ON	patients.PatientID = Prescriptions.PatientID
                INNER JOIN soap ON Patients.PatientID = SOAP.PatientID
                INNER JOIN AspNetUsers ON SOAP.CreadoPor = AspNetUsers.Id
                WHERE patients.CedulaIdentidad ='${user.cedula}'`
        })

        if (recipts.recordset.length > 0) {
            let reciptsArray = []
            for (let recipt of recipts.recordset) {
                // console.log(recipt)
                let invoid = await store.query('Invoid', { id: recipt.PrescriptionID })
                // console.log(invoid)
                if (invoid) {
                    recipt.invoid = invoid
                }
                reciptsArray.push(recipt)
            }
            console.log(reciptsArray)
            return reciptsArray;
        }
    }
    async function uploadInvoid(body, file, token) {
        let ext = file.mimetype.split('/')[1]
        let { PrescriptionID } = body;
        let { id } = verify(token);
        let user = await store.query("user", { id })
        if (ext === 'pdf') {
            let Prescriptions = await storeMariaDb.selector('Prescriptions', {
                select: `
                SELECT Prescriptions.PrescriptionAlergias, Prescriptions.Diagnostico,
                Prescriptions.PrescriptionID, SOAP.soapID, SOAP.soapDate
                FROM patients 
                inner JOIN Prescriptions ON	patients.PatientID = Prescriptions.PatientID
                INNER JOIN SOAP ON Patients.PatientID = SOAP.PatientID
                INNER JOIN AspNetUsers ON SOAP.CreadoPor = AspNetUsers.Id
                WHERE Prescriptions.PrescriptionID = ${PrescriptionID}
                AND patients.CedulaIdentidad ='${user.cedula}'`
            })
            if (Prescriptions.recordset.length > 0) {
                let { soapID, PrescriptionID, soapDate } = Prescriptions.recordset[0];
                let buffer = file.buffer
                let length = buffer.length
                let invoidId = await uploadBlob({ ext, data: buffer, length })
                console.log({ id: PrescriptionID, soapID, soapDate, cedula: `${user.cedula}`, Factura: 'prueba' })
                let inv = await store.upsert('Invoid', { id: PrescriptionID, soapID, soapDate: new Date(soapDate).toISOString().slice(0, 19).replace('T', ' '), cedula: `${user.cedula}`, Factura: invoidId })
                console.log(inv)
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
        uploadInvoid
    };
};