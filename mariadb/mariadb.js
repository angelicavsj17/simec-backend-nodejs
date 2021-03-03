const mssql = require('mssql');

const config = require('../config');

const dbconf = {
    server: config.mariadb.host,
    port: config.mariadb.port,
    user: config.mariadb.user,
    password: config.mariadb.password,
    database: config.mariadb.database,
    options: {
        "encrypt": true,
        "enableArithAbort": true
    },
    connectionLimit: 500,
    connectTimeout: 1000 * 60 * 60 * 24 * 10
};

let connection;

function handleCon() {
    connection = new mssql.ConnectionPool(dbconf).connect((err) => {
        if (err) {
            console.error('[db err]', err, "this is error");
            setTimeout(handleCon, 2000);
        } else {
            console.log('DB Connected .NET!');
        }
    })

    // connection = new mssql.connect(dbconf, (err) => {
    //     if (err) {
    //         console.error('[db err]', err, "this is error");
    //         setTimeout(handleCon, 2000);
    //     } else {
    //         console.log('DB Connected .NET!');
    //     }
    // });

    connection.on('error', err => {
        console.error('[db err]', err);
        // if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        handleCon();
        // } else {
        // throw err;
        // }
    })
}

handleCon();

setInterval(function () {
    try {
        connection.query('SELECT 1');
    } catch { }
}, 5000);

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE id=${id}`, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        })
    })
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

function upsert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

function query(table, query) {
    let entry = Object.entries(query)
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ${entry[0][0]} = ${entry[0][1]}`, (err, res) => {
            if (err) reject(err);
            resolve(res || null);
        })
    })
}
function selector(table, body) {
    return new Promise((resolve, reject) => {
        connection.query(body.select, (err, res) => {
            if (err) reject(err);
            resolve(res || null);
        })
    })
}
module.exports = {
    list,
    get,
    upsert,
    update,
    query,
    insert,
    selector
};