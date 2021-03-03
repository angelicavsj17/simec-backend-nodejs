const TABLA = 'ciudades';
module.exports = function (injectedStore, InjectedstoreMariaDb) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function getCities(body, token) {
        let recipts = await storeMariaDb.selector(TABLA, {
            select:
                `SELECT * FROM ciudades ORDER BY NombreCiudad ASC`
        })
        if (recipts.recordset.length > 0) {
            return recipts.recordset;
        }
    }
    async function getSpecialities(body, token) {
        let recipts = await storeMariaDb.selector(TABLA, {
            select:
                `SELECT * FROM Especialidads ORDER BY Nombre ASC`
        })
        if (recipts.recordset.length > 0) {
            return recipts.recordset;
        }
    }
    return {
        getCities,
        getSpecialities
    };
};