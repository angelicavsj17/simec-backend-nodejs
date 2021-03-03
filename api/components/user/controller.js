// tiene acceso a la parte de almancenamiento de datos 
const response = require('../../../network/response')
const { nanoid } = require('nanoid');
const auth = require('../auth/index');

const TABLA = 'user';

module.exports = function (injectedStore, InjectedstoreMariaDb) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb
    if (!store) {
        store = require('../../../store/dummy');
    }

    function list() {
        return store.list(TABLA);
    }

    function get(id) {
        return store.get(TABLA, id);
    }
    async function recover(username) {
        const data = await store.query(TABLA, { cedula: username });
        return {}
    }
    async function upsert(body) {
        let userData = await storeMariaDb.selector('patients', { select: `SELECT Sexo, FirstName, LastName, CedulaIdentidad, PatientEmail  from patients WHERE CedulaIdentidad = '${body.cedula}'` })
        if (userData.recordset.length > 0) {
            const user = {
                nombres: userData.recordset[0].FirstName || body.name,
                apellidos: userData.recordset[0].LastName || body.apellidos,
                cedula: body.cedula,
                correo: body.correo,
                contraseña: body.contraseña,
                genero: userData.recordset[0].Sexo || ''
            }
            if (userData.recordset[0].PatientEmail) {
                user.correo = userData.PatientEmail || body.correo
            }
            if (body.id) {
                user.id = body.id;
            } else {
                user.id = nanoid();
            }
            if (user.contraseña || user.cedula) {
                await auth.upsert({
                    id: user.id,
                    username: user.cedula,
                    password: user.contraseña,
                })
            }
            let data = await store.upsert(TABLA, user);
            return data
        }
    }

    return {
        list,
        get,
        upsert,
        recover
    };
}