// Importer les modules nécessaires
const WebSocket = require('ws'); // WebSocket
const mysql = require('mysql2'); // Connexion MySQL

// Connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tcgzone',
});

// Vérification de la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données réussie.');
  }
});

// Créer le serveur WebSocket
const wss = new WebSocket.Server({ port: 8080 });
console.log('Serveur WebSocket démarré sur ws://localhost:8080');

// Variable pour suivre les derniers messages envoyés
let lastMessageId = 0;

// Vérifier les nouveaux messages dans la table `messages` toutes les 2 secondes
setInterval(() => {
  const query = 'SELECT * FROM messages WHERE id_message > ? ORDER BY id_message ASC';
  db.query(query, [lastMessageId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages:', err);
      return;
    }

    if (results.length > 0) {
      results.forEach((message) => {
        // Diffuser chaque nouveau message à tous les clients connectés
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message)); // Envoyer le message au format JSON
          }
        });

        // Mettre à jour l'ID du dernier message traité
        lastMessageId = message.id_message;
      });
    }
  });
}, 2000); // Intervalle : 2 secondes

// Gérer les connexions WebSocket
wss.on('connection', (ws) => {
  console.log('Un client est connecté');

  ws.send('Bienvenue sur le serveur WebSocket !');

  // Gérer les messages reçus du client
  ws.on('message', (message) => {
    console.log('Message reçu du client:', message);

    // Ajouter le message dans la base de données
    const sender_id = 1; // Exemple : ID de l'expéditeur
    const receiver_id = 2; // Exemple : ID du destinataire
    const query = 'INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, ?)';
    db.query(query, [sender_id, receiver_id, message, 0], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion du message dans la base de données:', err);
        return;
      }
      console.log('Message ajouté dans la base de données.');
    });
  });

  // Gérer la déconnexion
  ws.on('close', () => {
    console.log('Un client s\'est déconnecté.');
  });
});
