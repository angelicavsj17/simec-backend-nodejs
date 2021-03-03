const mysql = require('mysql');

//const config = require('../config');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectionLimit: 500,
    connectTimeout: 1000 * 60 * 60 * 24 * 10
};

let connection;

function handleCon() {
    connection = mysql.createPool(dbconf);

    // connection.connect((err) => {
    //     if (err) {
    //         console.error('[db err]', err);
    //         setTimeout(handleCon, 2000);
    //     } else {
    //         console.log('DB Connected!');
    //     }
    // });

    connection.on('error', err => {
        console.error('[db err]', err);
        handleCon();
        // if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        //     handleCon();
        // } else {
        //     throw err;
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
            console.log(err)
            if (err) reject(err);
            resolve(result);
        })
    })
}

function update(table, data) {
    console.log(data)
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table} SET ? WHERE id=?`, [data, data.id], (err, result) => {
            if (err) return reject(err);
            console.log(result)
            resolve(result);
        })
    })
}

function upsert(table, data) {
    if (data && data.id) {
        return update(table, data);
    } else {
        return insert(table, data);
    }
}

function query(table, query) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, query, (err, res) => {
            if (err) return reject(err);
            resolve(res[0] || null);
        })
    })
}

module.exports = {
    list,
    get,
    upsert,
    update,
    query,
    insert
};