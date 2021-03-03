
const express =require('express');

const bodyparser = require('body-parser');

const config = require ('../config');

const router = require('./network');

const app = express();

app.use (bodyparser.json())

// RUTAS
app.use('/', router)


app.listen(config.mariadbService.port,()=>{
    console.log('servicio de mariadb escuchando en el puerto', config.mariadbService.port )
})


