const store = require('../../../store/remote-mysql')
const storeMariaDb = require('../../../mariadb/remote-mariadb')
const ctrl = require('./controller')
const client = require("jsreport-client")("http://13.85.152.21:5488/", "SimecReportes", "Simec2015")
module.exports = ctrl(store, storeMariaDb, client)