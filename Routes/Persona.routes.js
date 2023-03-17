const perController = require('../controllers/Persona.controller');
//creamos el manejador de rutas con express
const express = require('express');
const router = express.Router();
//definimos rutas 
 router.post('/post', perController.crear);//crea persona en general
router.post('/post/empleado',perController.verificarToken, perController.crearEmpleado); //crea empleados
router.get('/get/empleados',perController.verificarToken, perController.traerEmpleados); //trae empleados
router.get('/get/empleado/:usuario',perController.verificarToken, perController.traerEmpleadoU);
router.put('/put', perController.EditarPers);//trae empleado mediante su usuario(despues se va a volver el login)
router.post('/login', perController.Login);
module.exports = router;