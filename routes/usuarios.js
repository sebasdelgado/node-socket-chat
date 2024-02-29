const { Router } = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');

const { 
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

//Metodo GET para petición, se usa para obtener data
router.get('/', usuariosGet );

//Metodo PUT para petición, se usa en la actulización de la totalidad de la data
//:id es un parámetro de segmento (se envia en la url)
router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(), //Validamos que sea un ID válido de mongo
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom( esRoleValido ),
    //Ejecutamos el middleware de validar campos
    validarCampos
], usuariosPut );

//Metodo POST para petición, se usa para crear nuevos recursos
router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),//check almacena los errores de validacion
    check('password', 'El password debe tener 6 caracteres o más').isLength({ min: 6 }),
    check('correo', 'El correo no es válido' ).isEmail(),
    check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']), //Validamos que el rol este dentro de los valores del Arreglo
    check('rol').custom( esRoleValido ),
    validarCampos
], usuariosPost );

//Metodo DELETE para petición, se usa para borrar algo o marcarlo como eliminado con alguna bandera
router.delete('/:id', [
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(), //Validamos que sea un ID válido de mongo
    check('id').custom( existeUsuarioPorId ),
    validarCampos
], usuariosDelete );

//Metodo PUT para petición, se usa en la actulización parcial de la data
router.patch('/', usuariosPatch );




module.exports = router;