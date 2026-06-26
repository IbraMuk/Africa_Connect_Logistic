const db = require('../config/database-pg');

async function checkTables() {
  try {
    console.log('Vérification de la structure des tables...\n');
    
    // Vérifier la table clients
    const clientsColumns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'clients'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Structure de la table clients:');
    clientsColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    // Vérifier la table factures
    const facturesColumns = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'factures'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Structure de la table factures:');
    facturesColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkTables();
