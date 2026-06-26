const { Pool } = require('pg');

// Configuration de la connexion
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'africa_connect_logistic',
  password: 'Admin@123',
  port: 5432,
});

async function createFacturesTable() {
  try {
    console.log('Création de la table factures...');
    
    const client = await pool.connect();
    
    // Création de la table factures
    await client.query(`
      CREATE TABLE IF NOT EXISTS factures (
        id VARCHAR(50) PRIMARY KEY,
        "clientId" INTEGER NOT NULL REFERENCES clients(id),
        "dateFacture" DATE NOT NULL DEFAULT CURRENT_DATE,
        "dateEcheance" DATE NOT NULL,
        montant DECIMAL(10,2) NOT NULL,
        statut VARCHAR(20) DEFAULT 'En attente' CHECK (statut IN ('En attente', 'Payée', 'En retard', 'Annulée')),
        services JSONB NOT NULL DEFAULT '[]',
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table factures créée!');
    
    // Créer un index sur clientId pour les performances
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_factures_clientId ON factures("clientId")
    `);
    console.log('✅ Index créé sur clientId!');
    
    // Créer un index sur le statut
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_factures_statut ON factures(statut)
    `);
    console.log('✅ Index créé sur statut!');
    
    // Afficher la structure de la table
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'factures'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Structure de la table factures:');
    result.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default || ''}`);
    });
    
    console.log('\n✅ Table factures prête à l\'utilisation!');
    
    client.release();
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error.message);
  } finally {
    await pool.end();
  }
}

// Exécuter la création
createFacturesTable();
