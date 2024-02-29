const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async(termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ) {

        const usuario = await Usuario.findById( termino );

        return res.json({
            results : ( usuario ) ? [ usuario ] : []
        })
    }

    //creamos una expresión regular para que el nombre o correo sea insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i' );

    //Usamos el operador $or propio de mongo para filtrar por nombre o por correo
    //y el operador $and para filtar los usuarios activos nada mas 
    const usuarios = await Usuario.find({
        $or : [{ nombre : regex }, { correo : regex }],
        $and : [{ estado : true }]
    });

    const total = await Usuario.countDocuments({
        $or : [{ nombre : regex }, { correo : regex }],
        $and : [{ estado : true }]
    });


    res.json({
        results: usuarios,
        total
    });

}

const buscarCategorias = async(termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ) {

        const categoria = await Categoria.findById( termino );

        return res.json({
            results : ( categoria ) ? [ categoria ] : []
        })
    }

    //creamos una expresión regular para que el nombre sea insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i' );

    const categorias = await Categoria.find({ nombre : regex, estado : true });

    const total = await Categoria.countDocuments({ nombre : regex, estado : true });


    res.json({
        results: categorias,
        total
    });

}

const buscarProductos = async(termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID ) {

        const producto = await Producto.findById( termino ).populate('categoria','nombre');

        return res.json({
            results : ( producto ) ? [ producto ] : []
        })
    }

    //creamos una expresión regular para que el nombre sea insensible a mayusculas y minusculas
    const regex = new RegExp( termino, 'i' );

    const productos = await Producto.find({ nombre : regex, estado : true })
                                    .populate('categoria','nombre');

    const total = await Producto.countDocuments({ nombre : regex, estado : true });

    res.json({
        results: productos,
        total
    })

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params;

    if( !coleccionesPermitidas.includes( coleccion )) {
        return res.status(400).json({
            msg : `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }

    switch (coleccion) {
        case 'usuarios' :
            buscarUsuarios( termino, res);
            break;
        case 'categorias' :
            buscarCategorias( termino, res );
            break;
        case 'productos' :
            buscarProductos( termino, res );
            break;
        case 'roles' :

            break;
        
        default:
            res.status(500).json({
                msg: 'Busqueda no contemplada'
            })
    }

}

module.exports = {
    buscar
}