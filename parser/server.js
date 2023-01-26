var WebSocketServer = require("ws").Server;
const jwt = require('jsonwebtoken');
require('dotenv').config();
var parser = require('./gramatica');

var wss = new WebSocketServer({port: 8023});
var client;

console.log("WebSocketServer started on port 8023");

wss.broadcast = function broadcastMsg(msg) {
    console.log("conectado");
    let data = JSON.parse(msg);
    let result;
    jwt.verify(data.accessToken, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            result = {
                error : 403,
                msg: "No tienes los permisos necesarios"
            };
        }
        else {
            result = {
                error : null,
                solution : parser.parse(data.expresion.toString())
            };
        }
    });
    client.send(result.toString());
};

wss.on('connection', function connection(ws) {
    ws.on('message', wss.broadcast);
    client = ws;
});