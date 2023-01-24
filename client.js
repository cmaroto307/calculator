var accessToken;

async function register(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function login(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function peticion(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : data.token
        }
    });
    return response.json();
}

async function init() {
    await register('http://localhost:3000/register', {email:'alumno@ieszaidinvergeles.org', password:'12345678'})
    .then(response => {
        console.log("REGISTER:");
        console.log(response);
    });
    await login('http://localhost:3000/login', {email:'alumno@ieszaidinvergeles.org', password:'12345678'})
    .then(response => {
        accessToken = response.token;
        console.log("LOGIN:");
        console.log(response);
    });
    await peticion('http://localhost:3000/peticion', {token:'Bearer ' + accessToken})
    .then(response => {
        console.log("PETICION:");
        console.log(response);
    });
}

init();