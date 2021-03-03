const store = require('../../../store/remote-mysql')
const storeMariaDb = require('../../../mariadb/remote-mariadb')

const ctrl = require('./controller')

module.exports = ctrl(store, storeMariaDb)

