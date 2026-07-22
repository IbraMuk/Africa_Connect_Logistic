require("dotenv").config();
const { sequelize } = require("./config/database");

async function migrateCategories() {
  try {
    await sequelize.authenticate();
    console.log("✓ Connexion établie");

    // Vérifier si les colonnes existent déjà
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'categories'
    `);
    const existingColumns = columns.map(c => c.column_name.toLowerCase());

    const addColumn = async (columnName, columnDefinition) => {
      if (existingColumns.includes(columnName.toLowerCase())) {
        console.log(`  ⊘ Colonne ${columnName} existe déjà, ignorée`);
        return;
      }
      try {
        await sequelize.query(`ALTER TABLE categories ADD COLUMN "${columnName}" ${columnDefinition}`);
        console.log(`  ✓ Colonne ${columnName} ajoutée`);
      } catch (e) {
        console.warn(`  ⚠ Erreur lors de l'ajout de ${columnName}: ${e.message}`);
      }
    };

    console.log("\n=== Ajout des nouvelles colonnes ===");
    
    await addColumn("categorie", "VARCHAR(255) NOT NULL");
    await addColumn("sousCategorie", "VARCHAR(255)");

    // Supprimer les anciennes colonnes si elles existent
    const dropColumn = async (columnName) => {
      if (!existingColumns.includes(columnName.toLowerCase())) {
        console.log(`  ⊘ Colonne ${columnName} n'existe pas, ignorée`);
        return;
      }
      try {
        await sequelize.query(`ALTER TABLE categories DROP COLUMN IF EXISTS "${columnName}"`);
        console.log(`  ✓ Colonne ${columnName} supprimée`);
      } catch (e) {
        console.warn(`  ⚠ Erreur lors de la suppression de ${columnName}: ${e.message}`);
      }
    };

    console.log("\n=== Suppression des anciennes colonnes ===");
    await dropColumn("statut");
    await dropColumn("dateCreation");
    await dropColumn("dateModification");

    console.log("\n✓ Migration terminée avec succès\n");
  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    await sequelize.close();
  }
}

migrateCategories();
