const { response } = require("express");
const { Categoria } = require("../models");

const obtenerCategorias = async (req, res = response) => {

    //Obtenemos lo query params y desestructuramos cada valor poniendo valores por defecto
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, categorias] = await Promise.all([ //resuleve todas las promesas en simultaneo
        Categoria.countDocuments(query),
        Categoria.find(query) //Filtramos por estado activo
            .populate('usuario', 'nombre') //Obtenemos la información del usuario que tiene relacionado la categoria
            .skip(Number(desde)) //Líneas para la paginación 
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

const actualizarCategoria = async (req, res = response) => {

    //obtenemos los parametros de segemento
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //Buscamos por el id y actulizamos la informacion que esta en la variable data
    //el parámetro new : true regresa el documento actualizado
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    res.json(categoria);

}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    //Code 201 es creado
    res.status(201).json(categoria);

}

const  borrarCategoria = async( req, res = response ) => {

    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate( id, { estado: false }, { new : true });

    res.json( categoriaBorrada );
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    actualizarCategoria,
    obtenerCategoria,
    borrarCategoria
}