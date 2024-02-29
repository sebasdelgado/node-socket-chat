const { request, response } = require('express');
const { Usuario } = require('../models'); //Con la U mayuscula permite crear instancias de mi modelo
const bcryptjs = require('bcryptjs');

const usuariosGet = async( req = request, res = response ) => { // igualamos res a response para que res
                                                // tenga las propiedades de response, lo mismo con request

    //Obtenemos lo query params y desestructuramos cada valor poniendo valores por defecto
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado : true };


    const [ total, usuarios ] = await Promise.all([ //resuleve todas las promesas en simultaneo
        Usuario.countDocuments( query ),
        Usuario.find( query ) //Filtramos por estado activo
        .skip( Number( desde )) //Líneas para la paginación 
        .limit( Number( limite ))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async ( req, res ) => {

    //obtenemos los parametros de segemento
    const { id } = req.params;

    //Sacamos pasword y google porque no lo necesitamos y dejamos los demas parametros en la 
    //variable resto mediante el operador spread
    const { _id, password, google, correo, ...resto } = req.body;

    if ( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    //Buscamos por el id y actulizamos la informacion que esta en la variable resto, 
    //el parámetro new : true regresa el documento actualizado
    const usuario = await Usuario.findByIdAndUpdate( id, resto , { new : true });

    res.json(usuario);

    // res.status(400).json({ //code status Bad Request, los status 400 le dicen
    //                         // al front que algo estan  enviando mal 
    //     msg : 'put API'
    // });
}

const usuariosPost = async ( req, res = response ) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardar en DB
    await usuario.save();

    res.json(usuario);
}

const usuariosDelete = async( req, res ) => {

    const { id } = req.params;

    //Borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado : false }, { new : true });
    res.json(usuario);
}

const usuariosPatch = ( req, res ) => {
    res.json({
        msg : 'patch API'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}