const remote = require('../store/remote');

const config = require('../config');


module.exports = new remote(config.mariadbService.host, config.mariadbService.port);