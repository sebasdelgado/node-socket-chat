const { response } = require("express");

const validarArchivoSubir = ( req, res = response, next ) => {

    //Verificamos si existe el objeto file en la solicitud
    //Object.keys devuelve un array con las keys del objeto req.files y verificamos que sea mayor a cero
    //verificamos que la solciitud tenga el key llamado archivo 
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json( {
            msg :  'No hay archivos para subir - vaidarArchivoSubir'
        });
    }

    next();
}

module.exports = {
    validarArchivoSubir
}