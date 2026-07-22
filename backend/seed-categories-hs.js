require("dotenv").config();
const { sequelize } = require("./config/database");

// Données fournies par l'utilisateur : categorie_principale, sous_categorie, description, code_hs
const categories = [
  // Matières premières
  { categorie: "Matière première", sousCategorie: "Produits agricoles",  description: "Café, cacao, coton",                     codeHS: "09" },
  { categorie: "Matière première", sousCategorie: "Produits miniers",    description: "Cuivre, cobalt, or",                     codeHS: "26" },
  { categorie: "Matière première", sousCategorie: "Produits forestiers", description: "Bois brut, grumes",                      codeHS: "44" },

  // Produits semi-finis
  { categorie: "Semi-fini", sousCategorie: "Métaux transformés", description: "Acier laminé, aluminium", codeHS: "72" },
  { categorie: "Semi-fini", sousCategorie: "Textiles",           description: "Tissus, fils",             codeHS: "50" },

  // Produits finis
  { categorie: "Fini", sousCategorie: "Alimentaires",  description: "Conserves, boissons, chocolat",           codeHS: "16" },
  { categorie: "Fini", sousCategorie: "Manufacturés",  description: "Vêtements, chaussures, meubles",          codeHS: "61" },
  { categorie: "Fini", sousCategorie: "Équipements",   description: "Machines, véhicules, électroménager",     codeHS: "84" },

  // Marchandises spéciales
  { categorie: "Spécial", sousCategorie: "Produits dangereux",         description: "Carburants, produits chimiques", codeHS: "27" },
  { categorie: "Spécial", sousCategorie: "Périssables",                description: "Fruits frais, viande, poisson",  codeHS: "02" },
  { categorie: "Spécial", sousCategorie: "Réglementés",                description: "Médicaments, tabac, alcool",     codeHS: "30" },
  { categorie: "Spécial", sousCategorie: "Sous contrôle sanitaire",    description: "Animaux vivants, plantes",       codeHS: "01" },
];

async function seedCategoriesHS() {
  try {
    await sequelize.authenticate();
    console.log("✓ Connexion établie");

    // S'assurer que la table existe avec la structure complète
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" SERIAL PRIMARY KEY,
        "nom" VARCHAR(255) NOT NULL UNIQUE,
        "categorie" VARCHAR(255) NOT NULL,
        "sousCategorie" VARCHAR(255),
        "description" TEXT,
        "codeHS" VARCHAR(255)
      )
    `);
    console.log("✓ Table categories prête");

    // Ajouter les colonnes manquantes si la table existait déjà sans elles
    const [columns] = await sequelize.query(`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'categories'
    `);
    const columnNames = columns.map((c) => c.column_name);

    if (!columnNames.includes("sousCategorie")) {
      await sequelize.query(`ALTER TABLE "categories" ADD COLUMN "sousCategorie" VARCHAR(255)`);
      console.log("✓ Colonne sousCategorie ajoutée");
    }
    if (!columnNames.includes("codeHS")) {
      await sequelize.query(`ALTER TABLE "categories" ADD COLUMN "codeHS" VARCHAR(255)`);
      console.log("✓ Colonne codeHS ajoutée");
    }

    let inserted = 0;
    let skipped = 0;

    for (const cat of categories) {
      // "nom" doit être unique : on utilise la sous-catégorie comme nom
      const nom = cat.sousCategorie;
      try {
        const [, result] = await sequelize.query(
          `INSERT INTO "categories" ("nom", "categorie", "sousCategorie", "description", "codeHS")
           VALUES (:nom, :categorie, :sousCategorie, :description, :codeHS)
           ON CONFLICT ("nom") DO UPDATE SET
             "categorie" = EXCLUDED."categorie",
             "sousCategorie" = EXCLUDED."sousCategorie",
             "description" = EXCLUDED."description",
             "codeHS" = EXCLUDED."codeHS"`,
          { replacements: { nom, ...cat } }
        );
        inserted++;
        console.log(`  ✓ ${cat.categorie} > ${cat.sousCategorie} (HS ${cat.codeHS})`);
      } catch (e) {
        console.warn(`  ⚠ Ignoré: ${nom} - ${e.message}`);
        skipped++;
      }
    }

    const [[{ count }]] = await sequelize.query('SELECT COUNT(*) as count FROM "categories"');
    console.log(`\n✓ Terminé : ${inserted} insérées/mises à jour, ${skipped} ignorées`);
    console.log(`✓ Total en base : ${count} catégories\n`);
  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    await sequelize.close();
  }
}

seedCategoriesHS();
