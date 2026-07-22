require("dotenv").config();
const { sequelize } = require("./config/database");

async function migrateFactures() {
  try {
    await sequelize.authenticate();
    console.log("✓ Connexion établie");

    // Vérifier si les tables existent
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('factures', 'facture_marchandises')
    `);
    const existingTables = tables.map(t => t.table_name);

    // Supprimer l'ancienne table factures si elle existe avec l'ancienne structure
    if (existingTables.includes('factures')) {
      console.log("\n=== Suppression de l'ancienne table factures ===");
      try {
        await sequelize.query(`DROP TABLE IF EXISTS facture_marchandises CASCADE`);
        console.log("  ✓ Table facture_marchandises supprimée");
        await sequelize.query(`DROP TABLE IF EXISTS factures CASCADE`);
        console.log("  ✓ Table factures supprimée");
      } catch (e) {
        console.warn(`  ⚠ Erreur lors de la suppression: ${e.message}`);
      }
    }

    // Recréer les tables avec la nouvelle structure
    console.log("\n=== Création des nouvelles tables ===");
    
    await sequelize.query(`
      CREATE TABLE "factures" (
        "id" SERIAL PRIMARY KEY,
        "numeroFacture" VARCHAR(255) UNIQUE NOT NULL,
        "typeOperation" VARCHAR(20) NOT NULL CHECK ("typeOperation" IN ('import','export')),
        "dateFacture" DATE NOT NULL,
        "dateEcheance" DATE,
        "clientNom" VARCHAR(255) NOT NULL,
        "clientEmail" VARCHAR(255),
        "clientTelephone" VARCHAR(255),
        "clientAdresse" TEXT,
        "instructions" TEXT,
        "totalHT" DECIMAL(15,2) NOT NULL,
        "totalTVA" DECIMAL(15,2) NOT NULL,
        "totalTTC" DECIMAL(15,2) NOT NULL,
        "totalPoids" DECIMAL(12,2),
        "totalVolume" DECIMAL(12,2),
        "statut" VARCHAR(20) NOT NULL DEFAULT 'en_attente' CHECK ("statut" IN ('en_attente','payee','annulee')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("  ✓ Table factures créée");

    await sequelize.query(`
      CREATE TABLE "facture_marchandises" (
        "id" SERIAL PRIMARY KEY,
        "factureId" INTEGER NOT NULL,
        "marchandiseId" INTEGER NOT NULL,
        "reference" VARCHAR(255),
        "designation" VARCHAR(255) NOT NULL,
        "categorie" VARCHAR(255),
        "quantite" DECIMAL(12,2) NOT NULL,
        "poids" DECIMAL(10,2) NOT NULL,
        "volume" DECIMAL(10,3) NOT NULL,
        "prixUnitaire" DECIMAL(15,2) NOT NULL,
        "montantTotal" DECIMAL(15,2) NOT NULL,
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("factureId") REFERENCES "factures"("id") ON DELETE CASCADE
      )
    `);
    console.log("  ✓ Table facture_marchandises créée");

    // Créer les index
    console.log("\n=== Création des index ===");
    await sequelize.query(`CREATE UNIQUE INDEX IF NOT EXISTS "factures_numeroFacture_key" ON "factures" ("numeroFacture")`);
    console.log("  ✓ Index factures_numeroFacture_key créé");
    await sequelize.query(`CREATE INDEX IF NOT EXISTS "factures_typeOperation_idx" ON "factures" ("typeOperation")`);
    console.log("  ✓ Index factures_typeOperation_idx créé");
    await sequelize.query(`CREATE INDEX IF NOT EXISTS "factures_statut_idx" ON "factures" ("statut")`);
    console.log("  ✓ Index factures_statut_idx créé");
    await sequelize.query(`CREATE INDEX IF NOT EXISTS "factures_dateFacture_idx" ON "factures" ("dateFacture")`);
    console.log("  ✓ Index factures_dateFacture_idx créé");
    await sequelize.query(`CREATE INDEX IF NOT EXISTS "facture_marchandises_factureId_idx" ON "facture_marchandises" ("factureId")`);
    console.log("  ✓ Index facture_marchandises_factureId_idx créé");
    await sequelize.query(`CREATE INDEX IF NOT EXISTS "facture_marchandises_marchandiseId_idx" ON "facture_marchandises" ("marchandiseId")`);
    console.log("  ✓ Index facture_marchandises_marchandiseId_idx créé");

    console.log("\n✓ Migration terminée avec succès\n");
  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    await sequelize.close();
  }
}

migrateFactures();
