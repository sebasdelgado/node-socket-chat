const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketController } = require('../sockets/controller');

class Server {

    constructor(){

        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth : '/api/auth',
        }

        // Conectar a DB
        this.conectarDB();

        //Middlewares: Son funciones que añaden otra funcionalidad al webserver,
        //función que se ejecuta siempre cuando levantemos nuestro servidor
        this.middlewares();

        //Rutas de mi aplicación
        this.routes();

        //Sockets
        this.sockets();

    }

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Lectura y parseo del body
        this.app.use( express.json() );

        //Directorio público
        this.app.use( express.static('public') );

        //FileUpload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes() {
        
        this.app.use( this.paths.auth , require('../routes/auth'));
    }

    sockets() {

        this.io.on('connection', ( socket ) => socketController( socket, this.io ) );
    }

    listen() {

        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto',  this.port );
        });
    }
}

module.exports = Server;