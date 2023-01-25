var WebSocketServer = require("ws").Server;
const { v4: uuidv4 } = require('uuid');

var wss = new WebSocketServer({port: 8023});
var clients = [];

console.log("Server is Running...");

wss.broadcast = function broadcastMsg(msg) {
    let data = JSON.parse(msg);
    if(data.type != null) {
    	if(data.content.id) {
            let client = clients.find(item => item.id == data.content.id);
            if(client) {
                client.socket.send(JSON.stringify(data.content));
                if(data.content.funct ==  "exit") {
                    client.socket.close();
                    let indexOf = clients.findIndex(object => object.id == client.id);
                    clients.splice(indexOf, 1);
                }
            }
        }
    }
};

wss.on('connection', function connection(ws) {
    ws.on('message', wss.broadcast);
    let id = uuidv4();
    clients.push({
        id : id,
        socket : ws
    });
    const message = {
        funct: 'newClient',
        id : id
    }
    ws.send(JSON.stringify(message));
});