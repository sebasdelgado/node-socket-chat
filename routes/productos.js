const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto, obtenerProductos, actualizarProducto, obtenerProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

//Obtener todos los productos - público
router.get('/', obtenerProductos );

//Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto );

//Crear producto - privado - cualquier usuario con un token válido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo válido').isMongoId(),
    check('categoria','La categoria es obligatoria').not().isEmpty(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );

//Actualizar - privado - cualquier usuario con token válido
router.put('/:id',[
    validarJWT,
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto );

//Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto );

module.exports = router;