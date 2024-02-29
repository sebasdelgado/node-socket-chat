const { response } = require("express");
const { Usuario } = require("../models");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify.js");

const login = async( req, res = response ) => {

    const { correo, password } = req.body;

    try {
        
        //Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ) {
            return res.status(400).json({
                msg : 'Usuario / Password no son correctos - correo'
            });
        }

        //Verificar el estado del usuario
        if( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado : false'
            });
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                msg: 'usuario / Password no son correctos - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'No se pudo completar el Login, comuníquese con el administrador'
        })
    }

}

const googleSignIn = async ( req, res = response ) => {

    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        //Si no existe el usuariio lo creamos
        if ( !usuario ) {

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROL',
                google: true 
            }

            usuario = new Usuario( data );
            await usuario.save();

        }

        //Validamos el estado del usuario
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Usuario inactivo, comuníquese con el administrador'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch ( error ) {
        
        console.log('error', error );
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }


}

const renovarToken = async( req, res = response ) => {

    //Obtenemos el usuario que viene desde el middleware de validar token quien lo regresa
    //y lo obtenemos mediante la request
    const { usuario } = req;

    //Generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignIn,
    renovarToken
}