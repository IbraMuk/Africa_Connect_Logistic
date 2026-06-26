const db = require('../config/database-pg');

async function fixTimestamps() {
  try {
    console.log('Début de la correction des timestamps...');
    
    // Mettre à jour les clients sans createdAt
    await db.query(`
      UPDATE clients 
      SET "createdAt" = CURRENT_TIMESTAMP 
      WHERE "createdAt" IS NULL
    `);
    console.log('✅ Clients mis à jour');
    
    // Mettre à jour les clients sans updatedAt
    await db.query(`
      UPDATE clients 
      SET "updatedAt" = CURRENT_TIMESTAMP 
      WHERE "updatedAt" IS NULL
    `);
    console.log('✅ Clients updatedAt mis à jour');
    
    // Mettre à jour les factures sans createdAt
    await db.query(`
      UPDATE factures 
      SET "createdAt" = CURRENT_TIMESTAMP 
      WHERE "createdAt" IS NULL
    `);
    console.log('✅ Factures createdAt mises à jour');
    
    // Mettre à jour les factures sans updatedAt
    await db.query(`
      UPDATE factures 
      SET "updatedAt" = CURRENT_TIMESTAMP 
      WHERE "updatedAt" IS NULL
    `);
    console.log('✅ Factures updatedAt mises à jour');
    
    // Vérifier les autres tables qui pourraient avoir des timestamps NULL
    const tables = ['transports', 'reservations', 'billets', 'import_exports', 'vehicules', 'chauffeurs'];
    
    for (const table of tables) {
      try {
        await db.query(`
          UPDATE ${table} 
          SET "createdAt" = CURRENT_TIMESTAMP 
          WHERE "createdAt" IS NULL
        `);
        console.log(`✅ ${table} createdAt mis à jour`);
        
        await db.query(`
          UPDATE ${table} 
          SET "updatedAt" = CURRENT_TIMESTAMP 
          WHERE "updatedAt" IS NULL
        `);
        console.log(`✅ ${table} updatedAt mis à jour`);
      } catch (err) {
        console.log(`⚠️ Table ${table} non trouvée ou pas de colonne timestamps`);
      }
    }
    
    console.log('\n🎉 Tous les timestamps ont été corrigés avec succès !');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    process.exit(1);
  }
}

fixTimestamps();
