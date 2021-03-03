const request = require('request') // reques nos permite hacer peticiones htpp seguras  
function createRemoteDB(host, port) {
    const URL = 'http://' + host + ':' + port;  // base de url  

    function list(table) {
        return req('GET', table);
    }

    function get(table, id) {
        return req('GET', table, {}, id);
    }
    function upsert(table, data) {
        return req('POST', table, data);
    }
    function update(table, data) {
        return req('PUT', table, data);
    }
    function query(table, query, join) {
        return req('POST', table, query, "query");
    }
    function selector(table, select) {
        return req('POST', table, select, "selector");
    }
    function req(method, table, data, id) {
        let url = URL + '/' + table;
        let body = ""
        if (id) url += "/" + id;
        if (data) body = JSON.stringify(data) || "";
        return new Promise((resolve, reject) => {
            request({
                method,
                headers: {
                    'content-type': 'application/json'
                },
                url,
                body
            }, (err, req, body) => {
                if (err) {
                    console.error('Error con la base de datos remota', err);
                    return reject(err);
                }
                const resp = JSON.parse(body);
                return resolve(resp.body);
            })
        })
    }

    return {
        list,
        get,
        upsert,
        query,
        selector,
        update
    }
}

module.exports = createRemoteDB;