const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], actualizarImagenCloudinary );

router.get('/:coleccion/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])),
    validarCampos
], mostrarImagen )

module.exports = router;