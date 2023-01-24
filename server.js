const express = require('express');
const bp = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mydb = require("./bdmongo.js");

const app = express();
var accessToken;

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

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
            status: "El usuario no se ha podido logear"
        });
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.json({
                    error : 403,
                    status: "No tienes los permisos necesarios"
                });
            }
            req.user = user;
            next();
        });
    } else {
        res.json({
            error : 401,
            status: "El usuario no se encuentra logeado"
        });
    }
};

app.get('/peticion', authenticateJWT, (req, res) => {
    // Mandar jwt y la operacion
    res.json({
        error : null,
        msg: "Petición realizada",
    });
});