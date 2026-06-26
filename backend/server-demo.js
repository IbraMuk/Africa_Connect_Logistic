const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes de démonstration
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Africa Connect Logistic (Mode Démonstration)',
    version: '1.0.0',
    status: 'Demo Mode - No Database Connection',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register',
        profile: 'GET /api/auth/profile'
      },
      modules: [
        'Transport du personnel',
        'Transport de marchandises',
        'Réservation de billets',
        'Import/Export'
      ]
    }
  });
});

// Route d'authentification démo
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulation d'utilisateur démo
  if (email === 'admin@africaconnect.com' && password === 'admin123') {
    res.json({
      message: 'Connexion réussie (Mode Démonstration)',
      user: {
        id: 'demo-user-id',
        nom: 'Admin',
        prenom: 'System',
        email: 'admin@africaconnect.com',
        role: 'admin'
      },
      token: 'demo-jwt-token-12345'
    });
  } else {
    res.status(401).json({
      error: 'Erreur de connexion',
      message: 'Utilisateur démo: admin@africaconnect.com / admin123'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    message: 'Inscription réussie (Mode Démonstration)',
    user: {
      id: 'new-user-id',
      ...req.body
    },
    token: 'demo-jwt-token-new-user'
  });
});

// Routes démo pour chaque module
app.get('/api/personnel', (req, res) => {
  res.json({
    transports: [
      {
        id: 'demo-1',
        typeTransport: 'navette',
        pointDepart: 'Dakar',
        pointArrivee: 'Plateau',
        dateHeureDepart: '2024-01-31T14:30:00Z',
        statut: 'confirmé',
        prix: '$85'
      }
    ]
  });
});

app.get('/api/marchandise', (req, res) => {
  res.json({
    transports: [
      {
        id: 'demo-1',
        typeMarchandise: 'standard',
        poids: '100 kg',
        pointEnlevement: 'Port Autonome',
        pointLivraison: 'Aéroport',
        statut: 'en_transit',
        prix: '$145'
      }
    ]
  });
});

app.get('/api/billet', (req, res) => {
  res.json({
    billets: [
      {
        id: 'demo-1',
        typeTransport: 'avion',
        depart: 'Dakar',
        arrivee: 'Paris',
        dateHeureDepart: '2024-02-15T10:00:00Z',
        statut: 'réservé',
        prix: '$750'
      }
    ]
  });
});

app.get('/api/import-export', (req, res) => {
  res.json({
    operations: [
      {
        id: 'demo-1',
        typeOperation: 'export',
        paysDestination: 'France',
        portDepart: 'Dakar',
        statut: 'préparation',
        valeurMarchandise: '$8,500'
      }
    ]
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas (Mode Démonstration)`
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Serveur démarré en mode démonstration`);
  console.log(`========================================`);
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Utilisateur démo: admin@africaconnect.com`);
  console.log(`Mot de passe: admin123`);
  console.log(`========================================\n`);
});

module.exports = app;
