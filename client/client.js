var accessToken;

async function register(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
			"Accept": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

async function login(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
			"Accept": "application/json"
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
			"Accept": "application/json",
            'Authorization' : data.token
        }
    });
    return response.json();
}

async function init() {
    await peticion('http://localhost:3000/peticion', {token:'Bearer ' + accessToken})
    .then(response => {
        console.log("PETICION:");
        console.log(response);
    });
}

const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", handleRegisterFormSubmit);

function handleRegisterFormSubmit() {
    let emailRegister = document.getElementById("email-register").value;
    let passwordRegister = document.getElementById("password-register").value;
    register('http://localhost:3000/register', {email:emailRegister , password:passwordRegister})
    .then(response => {
        console.log("REGISTER:");
        console.log(response);
    });
}

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", handleLoginFormSubmit);

function handleLoginFormSubmit() {
    let emailLogin = document.getElementById("email-login").value;
    let passwordLogin = document.getElementById("password-login").value;
    login('http://localhost:3000/login', {email:emailLogin , password:passwordLogin})
    .then(response => {
        accessToken = response.token;
        console.log("LOGIN:");
        console.log(response);
    });
}