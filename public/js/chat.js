
let usuario = null;
let socket = null;

//Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

//validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    //Renovamos el token 
    const resp = await fetch( 'http://localhost:8080/api/auth/', {
        headers : { 'x-token' : token }
    });

    const { usuario: userDB, token : tokenDB } = await resp.json();

    //Reasignamos el token nuevo
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.nombre;

    await conectarSocket();
}

//Realizamos la conección con el socket
const conectarSocket = () => {

    //Enviamos el token al socket
    socket = io({
        'extraHeaders' : {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });

    socket.on('recibir-mensajes', dibujarMensajes );

    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado: ', payload );
    });
}

const dibujarUsuarios = ( usuarios = [] ) => {

    let userHtml = '';

    usuarios.forEach( ({ nombre, uid }) => {

        userHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ nombre }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = userHtml;
}

const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHtml = '';

    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) { return; }
    if( mensaje.trim().length === 0 ){ return; }

    socket.emit('enviar-mensaje', { mensaje, uid } );

    txtMensaje.value = '';

});

const main = async() => {

    //Validar JWT
    await validarJWT();
}

main();
