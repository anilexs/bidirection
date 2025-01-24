<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket avec PHP</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>WebSocket Demo avec PHP</h1>
    <input id="messageInput" type="text" placeholder="Tapez un message..." />
    <button id="sendBtn">Envoyer</button>
    <div id="log"></div>

    <script>
        // Connexion au serveur WebSocket
        const socket = new WebSocket('ws://localhost:8080');

        // Écouter les événements WebSocket
        socket.onopen = () => {
            console.log('Connecté au serveur WebSocket');
            document.getElementById('log').innerHTML += '<p>Connecté au serveur WebSocket</p>';
        };

        socket.onmessage = (event) => {
            console.log('Message reçu :', event.data);

            // Tenter de parser le message JSON envoyé par le serveur
            try {
                const message = JSON.parse(event.data);
                const log = document.getElementById('log');
                log.innerHTML += `<p><strong>Utilisateur ${message.sender_id} :</strong> ${message.content}</p>`;
            } catch (e) {
                console.error('Erreur lors du traitement du message :', e);
            }
        };

        socket.onerror = (error) => {
            console.error('Erreur WebSocket :', error);
        };

        socket.onclose = () => {
            console.log('Connexion WebSocket fermée');
            document.getElementById('log').innerHTML += '<p>Connexion fermée</p>';
        };

        // Envoyer un message au serveur
        document.getElementById('sendBtn').addEventListener('click', () => {
            const message = document.getElementById('messageInput').value;
            socket.send(message);
            document.getElementById('log').innerHTML += `<p><strong>Moi :</strong> ${message}</p>`;
            document.getElementById('messageInput').value = ''; // Réinitialiser le champ
        });
    </script>
</body>
</html>
