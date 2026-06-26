const { sequelize } = require('../config/database');
const Client = require('../models/Client');
const User = require('../models/User');

async function initDatabase() {
  try {
    console.log('Connexion à la base de données PostgreSQL...');
    
    // Test de connexion
    await sequelize.authenticate();
    console.log('✅ Connexion réussie à PostgreSQL!');
    
    // Synchronisation des modèles (création des tables)
    console.log('Création des tables...');
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Tables créées avec succès!');
    
    // Vérification des tables créées
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('\nTables créées:', tables);
    
    console.log('\n✅ Base de données initialisée avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Exécuter l'initialisation
initDatabase();
