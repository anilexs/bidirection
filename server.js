// node server.js


const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

console.log("Serveur WebSocket démarré sur ws://localhost:8080");

wss.on('connection', (ws) => {
    console.log('Client connecté !');
    ws.send('Bienvenue sur le serveur WebSocket !');

    ws.on('message', (message) => {
        console.log('Message reçu :', message);

        // Diffuse à tous les clients connectés
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Un client a dit : ${message}`);
            }
        });
    });
});

