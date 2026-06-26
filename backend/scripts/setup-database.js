const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  try {
    console.log('🚀 Démarrage de la configuration de la base de données...');
    
    // Lire et exécuter le script SQL des catégories
    const categoriesSQL = fs.readFileSync(
      path.join(__dirname, 'create-categories-table.sql'),
      'utf8'
    );
    
    console.log('📝 Création de la table categories...');
    await sequelize.query(categoriesSQL);
    console.log('✅ Table categories créée avec succès');
    
    // Lire et exécuter le script SQL des marchandises
    const marchandisesSQL = fs.readFileSync(
      path.join(__dirname, 'create-marchandise-table-v2.sql'),
      'utf8'
    );
    
    console.log('📦 Création de la table marchandises...');
    await sequelize.query(marchandisesSQL);
    console.log('✅ Table marchandises créée avec succès');
    
    // Vérifier les catégories
    const [categories] = await sequelize.query('SELECT * FROM categories');
    console.log(`\n📋 Catégories créées (${categories.length}):`);
    categories.forEach(cat => {
      console.log(`  - ${cat.categorie}`);
    });
    
    console.log('\n🎉 Base de données configurée avec succès !');
    console.log('\n🌐 Vous pouvez maintenant créer des marchandises via l\'interface web');
    console.log('   URL: http://localhost:3000/marchandise');
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
