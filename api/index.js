//SERVER
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const swaggerUi = require('swagger-ui-express');  // documentacion

const config = require('../config.js');

const user = require('./components/user/network');
const auth = require('./components/auth/network')
const soap = require('./components/soap/network');
const recipes = require('./components/recipes/network')
const orders = require('./components/orders/network')
const doctors = require('./components/doctors/network');
const utils = require('./components/utils/network');
const reports = require('./components/reports/network')
const app = express();

var jsreport = require('jsreport-core')()
jsreport.use(require('jsreport-chrome-pdf')())

app.use(cors())
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
const swaggerDoc = require('./swagger.json'); //llamamos documentancion
const PORT = process.env.PORT || 5000;

// ROUTER
app.use('/api/utils', utils);
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/soap', soap);
app.use('/api/recipes', recipes);
app.use('/api/orders', orders);
app.use('/api/doctors', doctors);
app.use('/api/reports', reports);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));


app.listen(process.env.PORT || 3000, () => {
    console.log('Api escuchando en el puerto ', process.env.PORT || 3000);
});

