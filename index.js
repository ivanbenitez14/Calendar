const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// CREAR EL SERVIDOR DE EXPRESS
const app = express();

// BASE DE DATOS
dbConnection();

//CORS
app.use(cors());

// DIRECTORIO PUBLICO
app.use( express.static('public') );

// LECTURA Y PARSEO DEL BODY
app.use( express.json() );

// RUTAS
// AUTH (CREAR, LOGIN Y RENEW)
app.use('/api/auth', require('./routes/auth') );
// CRUD: EVENTOS
app.use('/api/events', require('./routes/events') );

// ESCUCHAR PETICIONES 
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});