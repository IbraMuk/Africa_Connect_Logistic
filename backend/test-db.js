const { Sequelize } = require('sequelize');
require('dotenv').config();

async function testConnection() {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: console.log
    }
  );

  try {
    console.log('Tentative de connexion à la base de données...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie!');
    
    // Test de création d'une table
    await sequelize.getQueryInterface().createTable('test_table', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
    console.log('✅ Table de test créée!');
    
    // Suppression de la table de test
    await sequelize.getQueryInterface().dropTable('test_table');
    console.log('✅ Table de test supprimée!');
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('Détails:', error);
  }
}

testConnection();
