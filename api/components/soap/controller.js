
const bcrypt = require('bcrypt'); // crifrar contraseña
const TABLA = 'soap';
const { verify } = require('../../../auth/index')
module.exports = function (injectedStore, InjectedstoreMariaDb) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function query(body, token) {
        let { id } = verify(token);
        let user = await store.query("user", { id })
        let soap = await storeMariaDb.selector(TABLA, {
            select:
                `SELECT Especialidads.Nombre ,Cie10.descriptor, soap.SoapDate,soap.soapid, patients.PatientID ,soap.Subjetivo ,soap.Objetivo, soap.Analisis ,soap.Motivo ,AspNetUsers.Firstname, AspNetUsers.LastName ,AspNetUsers.especialidad , soap.analisis, Pedidos.PedidoID, Prescriptions.PrescriptionID ,Certificados.CertificadoID
                FROM soap 
                INNER  JOIN patients ON patients.PatientID = soap.PatientID
                LEFT JOIN Pedidos ON dateadd(dd,0, datediff(dd,0, Pedidos.FechaPedido)) = dateadd(dd,0, datediff(dd,0, SOAP.SoapDate)) AND Pedidos.PatientID = Patients.PatientID
                LEFT JOIN Prescriptions ON dateadd(dd,0, datediff(dd,0, Prescriptions.PrescriptionDate)) = dateadd(dd,0, datediff(dd,0, SOAP.SoapDate)) AND Prescriptions.PatientID = Patients.PatientID
                LEFT JOIN Certificados ON dateadd(dd,0, datediff(dd,0, Certificados.CertificadoDate)) =  dateadd(dd,0, datediff(dd,0, SOAP.SoapDate)) AND Certificados.PatientID = Patients.PatientID
                inner JOIN AspNetUsers ON soap.CreadoPor = AspNetUsers.Id 
                inner JOIN SoapsCieCodes ON SoapsCieCodes.SoapID = soap.soapid
                inner JOIN Cie10 ON SoapsCieCodes.CieID = Cie10.CieID
                inner JOIN UserTelemedicina ON UserTelemedicina.UserID = AspNetUsers.Id
                inner JOIN Especialidads ON Especialidads.EspecialidadID = UserTelemedicina.EspecialidadID
                WHERE patients.CedulaIdentidad = '${user.cedula}'`
        })
        if (soap.recordset.length > 0) {
            let records = soap.recordset
            let recordM = []
            for (let record of records) {
                let invoid = await store.query('Invoid', { soapID: `${record.soapid}` })
                if (invoid)
                    record.invoid = invoid
                recordM.push(record)
            }
            return recordM;
        }
    }
    return {
        query
    };
};