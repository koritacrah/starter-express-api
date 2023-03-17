const express = require('express');
const cors = require('cors');
const {mongoose} = require('./database');
var app = express(); 

app.use(express.json({limit: '25mb'}));
app.use(cors({origin: 'http://localhost:4200'}));
require('dotenv').config();

//declaramos las rutas que vamos a usar en el servidor y en cada 
/*
app.use('/user', require('./routes/user.routes.js'));
app.use('/transaccion', require('./routes/transaccion.routes'));
app.use('/tarjetas', require('./routes/tarjeta.routes'));
app.use('/menu', require('./routes/menu.routes'));
*/
app.use('/Persona', require('./routes/Persona.routes.js'));
app.use('/Reserva', require('./routes/Reserva.routes.js'));
//setting (decimos el puerto que va a usar el servidor)
app.set('port', process.env.PORT || 3000);
//starting the server, incia el server
app.listen(app.get('port'), () => {
console.log(`Server iniciado en puerto: `, app.get('port'));
});