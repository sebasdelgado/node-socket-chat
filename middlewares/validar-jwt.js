const { response } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const validarJWT = async( req, res = response, next ) => {

    const token = req.header('x-token');

    //Verificamos si enviaron token
    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }
   
    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //Leer usuario que está autenticado
        usuario = await Usuario.findById( uid );

        //Verificar siel uid tiene estado activo
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no activo'
            })
        }

        req.usuario = usuario;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
}

module.exports = {
    validarJWT
}