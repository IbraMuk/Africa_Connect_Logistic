const db = require('../config/database-pg');

async function fixNullTimestamps() {
  try {
    console.log('Début de la correction des timestamps NULL...\n');
    
    // Mettre à jour les clients sans createdat
    const result1 = await db.query(`
      UPDATE clients 
      SET "createdat" = CURRENT_TIMESTAMP 
      WHERE "createdat" IS NULL
    `);
    console.log(`✅ ${result1.rowCount} clients mis à jour (createdat)`);
    
    // Mettre à jour les clients sans updatedat
    const result2 = await db.query(`
      UPDATE clients 
      SET "updatedat" = CURRENT_TIMESTAMP 
      WHERE "updatedat" IS NULL
    `);
    console.log(`✅ ${result2.rowCount} clients mis à jour (updatedat)`);
    
    // Mettre à jour les factures sans createdAt
    const result3 = await db.query(`
      UPDATE factures 
      SET "createdAt" = CURRENT_TIMESTAMP 
      WHERE "createdAt" IS NULL
    `);
    console.log(`✅ ${result3.rowCount} factures mises à jour (createdAt)`);
    
    // Mettre à jour les factures sans updatedAt
    const result4 = await db.query(`
      UPDATE factures 
      SET "updatedAt" = CURRENT_TIMESTAMP 
      WHERE "updatedAt" IS NULL
    `);
    console.log(`✅ ${result4.rowCount} factures mises à jour (updatedAt)`);
    
    console.log('\n🎉 Tous les timestamps NULL ont été corrigés !');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
    process.exit(1);
  }
}

fixNullTimestamps();
