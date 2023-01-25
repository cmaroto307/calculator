const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const mydb = require("./bdmongo.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
var accessToken;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }
app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
});

app.post('/register', async (req, res) => {
    if (await mydb.addUser(req.body.email, req.body.password)){
        res.json({
            error: null,
            msg: "Usuario registrado"
        });
    }
    else {
        res.json({
            error: 401,
            msg: "El usuario no se ha podido registrar"
        });
    }
});

app.post('/login', async (req, res) => {
    if (await mydb.authUser(req.body.email, req.body.password)){
        accessToken = jwt.sign({
            email: req.body.email,
            password: req.body.password
        }, process.env.TOKEN_SECRET);
        res.json({
            error : null,
            msg: "Usuario logeado",
            token : accessToken
        });
    }
    else {
        res.json({
            error : 401,
            msg: "El usuario no se ha podido logear"
        });
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        accessToken = authHeader.split(' ')[1];
        jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.json({
                    error : 403,
                    msg: "No tienes los permisos necesarios"
                });
            }
            req.user = user;
            next();
        });
    } else {
        res.json({
            error : 401,
            msg: "El usuario no se encuentra logeado"
        });
    }
};

app.post('/calculate', authenticateJWT, (req, res) => {
    // Mandar jwt y la operacion
    let expression = req.body.operation;
    res.json({
        error : null,
        msg: "Operación recibida",
        operation: expression,
        token: accessToken
    });
});