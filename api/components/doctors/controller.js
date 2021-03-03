
const bcrypt = require('bcrypt'); // crifrar contraseña
const TABLA = 'UserTelemedicina';
const { verify } = require('../../../auth/index')
module.exports = function (injectedStore, InjectedstoreMariaDb) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function query(body, token, { city, speciality }) {
        let recipts = await storeMariaDb.selector(TABLA, {
            select:
                `SELECT TOP 100 AspNetUsers.Email, UserTelemedicina.UserID, UserTelemedicina.Mobile,Ciudades.CiudadID, 
                Especialidads.EspecialidadID,AspNetUsers.FirstName,AspNetUsers.LastName,
                AspNetUsers.DireccionMatriz,Ciudades.NombreCiudad,Especialidads.Nombre FROM UserTelemedicina
                INNER JOIN AspNetUsers ON AspNetUsers.Id = UserTelemedicina.UserID 
                INNER JOIN Ciudades ON Ciudades.CiudadID = UserTelemedicina.CiudadID
                INNER JOIN Especialidads ON Especialidads.EspecialidadID = UserTelemedicina.EspecialidadID 
                WHERE Especialidads.EspecialidadID = '${speciality}' AND Ciudades.CiudadID = '${city}'`
        })
        if (recipts.recordset.length > 0) {
            return recipts.recordset;
        }
        else {
            return []
        }
    }
    return {
        query
    };
};