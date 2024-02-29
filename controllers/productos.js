const { response } = require("express");
const { Producto } = require("../models");

const obtenerProductos = async (req, res = response) => {

    //Obtenemos lo query params y desestructuramos cada valor poniendo valores por defecto
    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [total, productos] = await Promise.all([ //resuleve todas las promesas en simultaneo
        Producto.countDocuments(query),
        Producto.find(query) //Filtramos por estado activo
            .populate('usuario', 'nombre') //Obtenemos la información del usuario que tiene relacionado el producto
            .populate('categoria', 'nombre')
            .skip(Number(desde)) //Líneas para la paginación 
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });
}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre')
                                                .populate('categoria', 'nombre');

    res.json(producto);
}

const actualizarProducto = async (req, res = response) => {

    //obtenemos los parametros de segemento
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    //Buscamos por el id y actualizamos la informacion que esta en la variable data
    //el parámetro new : true regresa el documento actualizado
    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json(producto);

}

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre : body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `EL producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //Guardar en DB
    await producto.save();

    //Code 201 es creado
    res.status(201).json(producto);

}

const  borrarProducto = async( req, res = response ) => {

    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate( id, { estado: false }, { new : true });

    res.json( productoBorrado );
}

module.exports = {
    crearProducto,
    obtenerProductos,
    actualizarProducto,
    obtenerProducto,
    borrarProducto
}