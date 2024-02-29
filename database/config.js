const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        
        //usamos await debido a que regresa una promesa
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        });

        console.log('Base de datos online');

    } catch ( error ) {
        throw new Error('Error a la hora de iniciar la base de datos ' + error);
    }
}

module.exports = {
    dbConnection
}