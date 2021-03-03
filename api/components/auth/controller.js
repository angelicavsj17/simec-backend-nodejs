
const bcrypt = require('bcrypt'); // crifrar contraseña
const auth = require('../../../auth'); //token
const TABLA = 'auth';

module.exports = function (injectedStore, InjectedstoreMariaDb) {
    let store = injectedStore;
    let storeMariaDb = InjectedstoreMariaDb
    if (!store) {
        store = require('../../../store/dummy');
    }

    async function login(username, password) {
        const data = await store.query(TABLA, { username: username });
        const user = await store.query('user', { cedula: username });
        return bcrypt.compare(password, data.password)
            .then(sonIguales => {
                if (sonIguales === true) {
                    return { user: { nombres: user.nombres }, token: auth.sign({ ...data }) }
                } else {
                    throw new Error('Informacion invalida');
                }
            });
    }
    async function recover(username, email) {
        const data = await store.query("user", { cedula: username });
        if (data.correo === email) {
            if (data)
                return data;
            else {
                return null
            }
        } else {
            return null
        }
    }

    async function upsert(data) {
        const authData = {
            id: data.id,
        }

        if (data.username) {
            authData.username = data.username;
        }

        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5);
        }

        return store.upsert(TABLA, authData);
    }
    async function restore({ password, repeatPassword, token }) {
        try {
            let { username } = auth.verify(token)
            const { id } = await store.query('auth', { username: username });
            const user = await store.query('user', { cedula: username });
            if (password === repeatPassword) {
                if (password.length < 8)
                    return { error: { msg: "La contraseña debe tener 8 caracteres" } }
                else {
                    await store.update('auth', { id, password: await bcrypt.hash(password, 5) })
                    await store.update('user', { id: user.id, contraseña: password })
                    return {}
                }
            }
            else {
                return { error: { msg: "Las contraseñas no coinciden" } }
            }
        } catch {
            return { error: { msg: "El token ya expiro" } }
        }
    }
    return {
        login,
        upsert,
        recover,
        restore
    };
};