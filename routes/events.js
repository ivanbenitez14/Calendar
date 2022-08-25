/*
    EVENT ROUTES
    /api/events
*/

const { Router } = require("express");
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");


const router = Router();

// SE APLICA LA VALIDACION A TODAS LAS RUTAS SIN TENER QUE PONERLE A CADA UNA
router.use( validarJWT );


// OBTENER EVENTOS 
router.get(
    '/',
    validarCampos,
    getEventos 
);

// CREAR UN NUEVO EVENTO
router.post(
    '/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ], 
    crearEvento 
);


// ACTUALIZAR EVENTO
router.put(
    '/:id',
    validarCampos, 
    actualizarEvento 
);


// BORRAR EVENTO
router.delete(
    '/:id',
    validarCampos, 
    eliminarEvento 
);




module.exports= router;
