const miFormulario = document.querySelector('form');

miFormulario.addEventListener('submit', ev => {
    
    //Evitamos el refresh del navegador web
    ev.preventDefault();
    const formData = {}

    //Recorremos el formulario y obtenemos en formData los campos y valores del formulario
    for( let el of miFormulario.elements ) {
        if ( el.name.length > 0 )
            formData[el.name] = el.value;
    }

    fetch('http://localhost:8080/api/auth/login', {
        method : 'POST',
        body: JSON.stringify( formData ),
        headers : { 'Content-Type' : 'application/json' }
    })
    .then( resp => resp.json() )
    .then( ({ msg, token })  => {

        if( msg ) {
            return console.error( msg );
        }

        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( err => {
        console.log( err );
    });


})

function handleCredentialResponse(response) {
            
    //Google Token : ID_TOKEN
    // console.log('id_token', response.credential);
    
    const body = { id_token : response.credential };
    
    fetch('http://localhost:8080/api/auth/google', {
        method : 'POST',
        headers : {
            'Content-Type':'application/json'
        },
        body: JSON.stringify( body )
    })
    .then( resp => resp.json() )
    .then( ( { token }) => {
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch( console.warn );
}

const button = document.getElementById('google_signout');

button.onclick = () => {

    google.accounts.id.disableAutoSelect();

    google.accounts.id.revoke(localStorage.getItem('email'), done =>{
        localStorage.clear();
        location.reload();
   });
}