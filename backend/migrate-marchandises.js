require("dotenv").config();
const { sequelize } = require("./config/database");

async function migrateMarchandises() {
  try {
    await sequelize.authenticate();
    console.log("✓ Connexion établie");

    // Vérifier si les colonnes existent déjà
    const [columns] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'marchandises'
    `);
    const existingColumns = columns.map(c => c.column_name.toLowerCase());

    const addColumn = async (columnName, columnDefinition) => {
      if (existingColumns.includes(columnName.toLowerCase())) {
        console.log(`  ⊘ Colonne ${columnName} existe déjà, ignorée`);
        return;
      }
      try {
        await sequelize.query(`ALTER TABLE marchandises ADD COLUMN "${columnName}" ${columnDefinition}`);
        console.log(`  ✓ Colonne ${columnName} ajoutée`);
      } catch (e) {
        console.warn(`  ⚠ Erreur lors de l'ajout de ${columnName}: ${e.message}`);
      }
    };

    console.log("\n=== Ajout des nouvelles colonnes ===");
    
    await addColumn("categoriePrincipale", "VARCHAR(50) NOT NULL DEFAULT 'Fini' CHECK (\"categoriePrincipale\" IN ('Matière première','Semi-fini','Fini','Spécial'))");
    await addColumn("codeHS", "VARCHAR(10)");
    await addColumn("quantite", "DECIMAL(12,2)");
    await addColumn("unite", "VARCHAR(20) DEFAULT 'kg' CHECK (\"unite\" IN ('kg','tonne','m3','litre','unité','carton','palette'))");
    await addColumn("valeurMarchande", "DECIMAL(15,2)");
    await addColumn("devise", "VARCHAR(10) DEFAULT 'USD' CHECK (\"devise\" IN ('USD','EUR','CDF','XAF','XOF'))");
    await addColumn("paysOrigine", "VARCHAR(100)");
    await addColumn("paysDestination", "VARCHAR(100)");
    await addColumn("exigencesReglementaires", "TEXT");
    await addColumn("conditionsStockage", "TEXT");
    await addColumn("documentsAssocies", "TEXT");
    await addColumn("observations", "TEXT");

    // Créer les index si ils n'existent pas
    console.log("\n=== Création des index ===");
    
    const [indexes] = await sequelize.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'marchandises'
    `);
    const existingIndexes = indexes.map(i => i.indexname.toLowerCase());

    const addIndex = async (indexName, column) => {
      if (existingIndexes.includes(indexName.toLowerCase())) {
        console.log(`  ⊘ Index ${indexName} existe déjà, ignoré`);
        return;
      }
      try {
        await sequelize.query(`CREATE INDEX "${indexName}" ON marchandises ("${column}")`);
        console.log(`  ✓ Index ${indexName} créé`);
      } catch (e) {
        console.warn(`  ⚠ Erreur lors de la création de l'index ${indexName}: ${e.message}`);
      }
    };

    await addIndex("marchandises_categorieprincipale_idx", "categoriePrincipale");
    await addIndex("marchandises_codehs_idx", "codeHS");
    await addIndex("marchandises_paysorigine_idx", "paysOrigine");
    await addIndex("marchandises_paysdestination_idx", "paysDestination");

    console.log("\n✓ Migration terminée avec succès\n");
  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    await sequelize.close();
  }
}

migrateMarchandises();
