const db = require('../config/database-pg');

async function fixClientType() {
  try {
    console.log('Début de la correction du type client...\n');

    // 1. Mettre à jour les valeurs NULL ou invalides
    console.log('1. Mise à jour des valeurs NULL...');
    await db.query(`
      UPDATE clients 
      SET type = 'Particulier' 
      WHERE type IS NULL OR type NOT IN ('Particulier', 'Entreprise')
    `);
    console.log('✅ Valeurs NULL mises à jour');

    // 2. Supprimer le type ENUM s'il existe
    console.log('\n2. Suppression de l\'ancien type ENUM...');
    try {
      await db.query(`DROP TYPE IF EXISTS "enum_clients_type"`);
      console.log('✅ Ancien type ENUM supprimé');
    } catch (err) {
      console.log('ℹ️ Ancien type ENUM non trouvé');
    }

    // 3. Créer le nouveau type ENUM
    console.log('\n3. Création du nouveau type ENUM...');
    await db.query(`
      CREATE TYPE "enum_clients_type" AS ENUM('Particulier', 'Entreprise')
    `);
    console.log('✅ Nouveau type ENUM créé');

    // 4. Supprimer d'abord la valeur par défaut
    console.log('\n4. Suppression de la valeur par défaut...');
    await db.query(`
      ALTER TABLE clients 
      ALTER COLUMN type DROP DEFAULT
    `);
    console.log('✅ Valeur par défaut supprimée');

    // 5. Modifier la colonne pour utiliser le nouveau type
    console.log('\n5. Modification de la colonne type...');
    await db.query(`
      ALTER TABLE clients 
      ALTER COLUMN type TYPE "enum_clients_type" 
      USING type::"enum_clients_type"
    `);
    console.log('✅ Colonne type modifiée');

    // 6. Ajouter la nouvelle valeur par défaut
    console.log('\n6. Ajout de la nouvelle valeur par défaut...');
    await db.query(`
      ALTER TABLE clients 
      ALTER COLUMN type SET DEFAULT 'Particulier'
    `);
    console.log('✅ Valeur par défaut ajoutée');

    // 7. Vérifier le résultat
    console.log('\n7. Vérification de la structure...');
    const result = await db.query(`
      SELECT column_name, data_type, udt_name 
      FROM information_schema.columns 
      WHERE table_name = 'clients' AND column_name = 'type'
    `);

    console.log('\n📋 Structure de la colonne type:');
    console.log(`  - Nom: ${result.rows[0].column_name}`);
    console.log(`  - Type: ${result.rows[0].udt_name}`);

    // 8. Compter les clients par type
    console.log('\n8. Répartition des clients:');
    const countResult = await db.query(`
      SELECT type, COUNT(*) as count 
      FROM clients 
      GROUP BY type
    `);

    countResult.rows.forEach(row => {
      console.log(`  - ${row.type}: ${row.count} client(s)`);
    });

    console.log('\n🎉 Correction terminée avec succès !');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Erreur lors de la correction:', error.message);
    process.exit(1);
  }
}

fixClientType();
