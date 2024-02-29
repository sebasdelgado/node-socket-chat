require('dotenv').config();
const Server = require('./models/server');

//Declaramos la instancia de nuestra clase servidor
const server = new Server();

server.listen();
