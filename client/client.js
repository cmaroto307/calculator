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

async function calculate(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
			"Accept": "application/json",
            'Authorization' : data.token
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", handleRegisterFormSubmit);

function handleRegisterFormSubmit() {
    let emailRegister = document.getElementById("email-register").value;
    let passwordRegister = document.getElementById("password-register").value;
    register('http://localhost:3000/register', {email:emailRegister , password:passwordRegister})
    .then(response => {
        //console.log("REGISTER:");
        //console.log(response);
        handleAlertMsg(response);
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
        //console.log("LOGIN:");
        //console.log(response);
        handleAlertMsg(response);
        if(response.error==null){
            viewCalculator();
            const calculateForm = document.getElementById("calculate-form");
            calculateForm.addEventListener("submit", handleCalculateFormSubmit);
        }
    });
}

function handleCalculateFormSubmit() {
    let valueOperation = document.getElementById("operation").value;
    calculate('http://localhost:3000/calculate', {token:'Bearer ' + accessToken , operation:valueOperation})
    .then(response => {
        //console.log("CALCULATE:");
        //console.log(response);
        handleAlertMsg(response);
        if(response.error==null){
            document.getElementById("operation").value = response.solution;
        }
    });
}

function handleAlertMsg(response) {
    let alertMsg = document.getElementById("alert-msg");
    if (response.error){
        alertMsg.setAttribute("class", "alert-danger");
    }
    else {
        alertMsg.setAttribute("class", "alert-success");
    }
    alertMsg.innerHTML = response.msg;
}

function viewCalculator() {
    let forms = document.getElementById("forms");
    forms.innerHTML = "";

    let elem = document.createElement("div");
    elem.setAttribute("id", "formCalculate");
    elem.setAttribute("class", "text-center");
    forms.appendChild(elem);
    let father = elem;

    elem = document.createElement("br");
    father.appendChild(elem);

    elem = document.createElement("h3");
    elem.setAttribute("class", "font-montserrat cover-heading mb20 mt20");
    elem.innerText = "Calculator";
    father.appendChild(elem);

    elem = document.createElement("form");
    elem.setAttribute("class", "clearfix mb35");
    elem.setAttribute("id", "calculate-form");
    father.appendChild(elem);
    father = elem;

    elem = document.createElement("div");
    elem.setAttribute("class", "col-sm-8 col-sm-offset-2");
    father.appendChild(elem);
    let elem_form = father;
    father = elem;

    elem = document.createElement("input");
    elem.setAttribute("type", "text");
    elem.setAttribute("id", "operation");
    elem.setAttribute("class", "form-control text-center no-border input-lg input-circle bg-light-transparent");
    elem.setAttribute("placeholder", "Ej. (2+4)/5=");
    father.appendChild(elem);

    elem = document.createElement("div");
    elem.setAttribute("class", "col-sm-8 col-sm-offset-2 mt5");
    elem_form.appendChild(elem);
    father = elem;

    elem = document.createElement("input");
    elem.setAttribute("type", "submit");
    elem.setAttribute("value", "Calculate");
    elem.setAttribute("class", "button button-lg button-circle button-block button-pasific hover-ripple-out");
    father.appendChild(elem);

    elem = document.createElement("br");
    father.appendChild(elem);

    elem = document.createElement("br");
    father.appendChild(elem);

    elem = document.createElement("div");
    elem.setAttribute("id", "alert-msg");
    elem.setAttribute("class", "alert");
    elem.setAttribute("role", "alert");
    forms.appendChild(elem);
}