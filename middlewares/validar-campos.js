const { validationResult } = require('express-validator');

//Los middlewares tiene un terer argumento llamado next que es para continuar 
//con el siguiente middleware o en su defecto el controlador si la validadión es exitosa
const validarCampos = ( req, res, next ) => {

    const errors = validationResult(req);

    if( !errors.isEmpty() ){
        return res.status(400).json(errors); //request code 400 means Bad Request
    }

    next();
}

module.exports = {
    validarCampos
}