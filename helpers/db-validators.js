const { Usuario, Role, Categoria, Producto } = require('../models'); //Con la U mayuscula permite crear instancias de mi modelo

const esRoleValido = async( rol = '' ) => {

    //Validamos el rol consultando los roles permitidos en DB
    const existeRole = await Role.findOne({ rol });

    if ( !existeRole ) {
        throw new Error(`EL rol ${ rol } no está registrado en la base de datos`)
    }
}

const emailExiste = async( correo = '' ) => {

    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });

    if (existeEmail) {
        throw new Error(`EL correo ${ correo } ya está registrado en la base de datos`);
    }
}

const existeUsuarioPorId = async( id ) => {

    //Verificar si el id existe
    const existeUsuario = await Usuario.findById( id );

    if ( !existeUsuario ) {
        throw new Error(`El id ${ id } no está registrado en la base de datos`);
    }
}

const existeCategoriaPorId = async( id ) => {

    //Verificar si el id existe
    const existeCategoria = await Categoria.findById( id );

    if ( !existeCategoria ) {
        throw new Error(`El id ${ id } no está registrado en la base de datos`);
    }
} 

const existeProductoPorId = async( id ) => {

    //Verificar si el id existe
    const existeProducto = await Producto.findById( id );

    if ( !existeProducto ) {
        throw new Error(`El id ${ id } no está registrado en la base de datos`);
    }
}

const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida - ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}

