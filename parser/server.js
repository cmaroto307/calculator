var WebSocketServer = require("ws").Server;
const jwt = require('jsonwebtoken');
require('dotenv').config();
var parser = require('./gramatica');

var wss = new WebSocketServer({port: 8023});

console.log("WebSocketServer started on port 8023");

wss.on('connection', (ws, msg) => {
    let data = JSON.parse(msg);
    let result;
    jwt.verify(data.token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            result = {
                error : 403,
                msg: "No tienes los permisos necesarios"
            };
        }
        else {
            result = {
                error : null,
                solution : parser.parse(JSON.stringify(data.operation))
            };
        }
    });
    ws.send(JSON.stringify(result));
});