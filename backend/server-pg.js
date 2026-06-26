const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database-pg');

// Importer les routes
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients-pg');
const factureRoutes = require('./routes/factures-pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/factures', factureRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API Africa Connect Logistic (PostgreSQL)',
    version: '1.0.0',
    modules: [
      'Transport du personnel',
      'Transport de marchandises',
      'Réservation de billets',
      'Import/Export',
      'Gestion des clients'
    ]
  });
});

// Route de test de la base de données
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Connexion à la base de données réussie',
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: error.message
    });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Démarrer le serveur
app.listen(PORT, async () => {
  console.log(`\n🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🔧 Test DB: http://localhost:${PORT}/api/test-db`);
  
  // Test de connexion à la base de données
  try {
    await db.query('SELECT NOW()');
    console.log('✅ Connexion à PostgreSQL établie');
  } catch (error) {
    console.error('❌ Erreur de connexion à PostgreSQL:', error.message);
  }
});
