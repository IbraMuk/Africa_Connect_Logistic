const { sequelize } = require('../config/database');
const Client = require('../models/Client');
const Facture = require('../models/Facture');

async function fixDatabaseSchema() {
  try {
    console.log('Début de la correction du schéma de la base de données...');
    
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ alter: true });
    
    console.log('✅ Schéma de la base de données corrigé avec succès');
    console.log('✅ Tables synchronisées');
    
    // Vérifier les clients
    const clientCount = await Client.count();
    console.log(`✅ Nombre de clients dans la base: ${clientCount}`);
    
    // Vérifier les factures
    const factureCount = await Facture.count();
    console.log(`✅ Nombre de factures dans la base: ${factureCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    process.exit(1);
  }
}

fixDatabaseSchema();
