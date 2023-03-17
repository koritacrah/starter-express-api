const resController = require('../controllers/Reserva.controller');
const perController = require('../controllers/Persona.controller');
const express = require('express');
const router = express.Router();

router.post('/post', resController.crear);//crea una reserva
router.get('/traer',  resController.traerTodas);// trae todas las reservas
router.get('/traer/:id', perController.verificarToken,resController.traerUno);
router.get('/traerfirmas', perController.verificarToken,resController.TraerDiferenciadas);//trae todas las reservas pero separadas por firmadas y no firmadas.
router.put('/editar/:id', resController.editar);

module.exports = router;