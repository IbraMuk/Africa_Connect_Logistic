require("dotenv").config();
const { sequelize } = require("./config/database");

const categories = [
  // ─── ALIMENTAIRE ET BOISSONS ───────────────────────────────────────────────
  { nom: "Céréales et grains",           categorie: "Alimentaire et Boissons",      description: "Blé, maïs, riz, sorgho, mil, orge, avoine et autres céréales" },
  { nom: "Huiles alimentaires",          categorie: "Alimentaire et Boissons",      description: "Huile de palme, de soja, de tournesol, d'olive et autres huiles comestibles" },
  { nom: "Sucre et confiseries",         categorie: "Alimentaire et Boissons",      description: "Sucre brut, sucre raffiné, confiseries, chocolat et produits sucrés" },
  { nom: "Conserves et denrées",         categorie: "Alimentaire et Boissons",      description: "Conserves de légumes, de viande, de poisson, lait en poudre, farine" },
  { nom: "Boissons non alcoolisées",     categorie: "Alimentaire et Boissons",      description: "Eau minérale, jus de fruits, sodas, sirops et boissons énergisantes" },
  { nom: "Boissons alcoolisées",         categorie: "Alimentaire et Boissons",      description: "Bières, vins, spiritueux, liqueurs et boissons alcoolisées diverses" },
  { nom: "Café et thé",                  categorie: "Alimentaire et Boissons",      description: "Café vert, café torréfié, thé noir, thé vert, tisanes et infusions" },
  { nom: "Épices et condiments",         categorie: "Alimentaire et Boissons",      description: "Sel, poivre, piment, moutarde, vinaigre, sauce et condiments divers" },
  { nom: "Produits laitiers et œufs",    categorie: "Alimentaire et Boissons",      description: "Lait frais, fromage, beurre, yaourt, crème fraîche et œufs" },
  { nom: "Viandes et poissons",          categorie: "Alimentaire et Boissons",      description: "Viande bovine, porcine, volaille, poisson frais, fumé ou séché" },

  // ─── MATÉRIAUX DE CONSTRUCTION ──────────────────────────────────────────────
  { nom: "Ciment et béton",              categorie: "Matériaux de Construction",    description: "Ciment Portland, ciment spécial, béton prêt à l'emploi et mortier" },
  { nom: "Fer à béton et acier",         categorie: "Matériaux de Construction",    description: "Barres d'armature, profilés métalliques, tôles et structures en acier" },
  { nom: "Bois de construction",         categorie: "Matériaux de Construction",    description: "Planches, chevrons, contreplaqué, bois lamellé-collé et parquet" },
  { nom: "Carrelage et céramique",       categorie: "Matériaux de Construction",    description: "Carrelage sol et mur, faïence, mosaïque, marbre et pierres naturelles" },
  { nom: "Peintures et revêtements",     categorie: "Matériaux de Construction",    description: "Peinture intérieure/extérieure, vernis, enduit, crépi et imperméabilisants" },
  { nom: "Tuyauterie et plomberie",      categorie: "Matériaux de Construction",    description: "Tuyaux PVC, fonte, cuivre, raccords, robinetterie et sanitaires" },
  { nom: "Menuiserie aluminium et PVC",  categorie: "Matériaux de Construction",    description: "Portes, fenêtres, volets, stores, vérandas et structures aluminium/PVC" },
  { nom: "Matériaux d'isolation",        categorie: "Matériaux de Construction",    description: "Laine de roche, polystyrène, membranes d'étanchéité et isolants thermiques" },
  { nom: "Agrégats et granulats",        categorie: "Matériaux de Construction",    description: "Sable, gravier, gravillons, pierraille et tout-venant" },

  // ─── ÉQUIPEMENTS ET MACHINES ────────────────────────────────────────────────
  { nom: "Machines industrielles",       categorie: "Équipements et Machines",      description: "Machines de production, presses, tours, fraiseuses et équipements industriels" },
  { nom: "Équipements agricoles",        categorie: "Équipements et Machines",      description: "Tracteurs, moissonneuses, motoculteurs, pompes d'irrigation et outillage agricole" },
  { nom: "Génératrices et groupes",      categorie: "Équipements et Machines",      description: "Groupes électrogènes, onduleurs, stabilisateurs de tension et UPS" },
  { nom: "Équipements de froid",         categorie: "Équipements et Machines",      description: "Climatiseurs, réfrigérateurs industriels, chambres froides et congélateurs" },
  { nom: "Outillage et quincaillerie",   categorie: "Équipements et Machines",      description: "Outils à main, outils électriques, boulonnerie, visserie et fixations" },
  { nom: "Équipements de levage",        categorie: "Équipements et Machines",      description: "Grues, chariots élévateurs, treuils, palans et équipements de manutention" },
  { nom: "Pompes et compresseurs",       categorie: "Équipements et Machines",      description: "Pompes à eau, pompes industrielles, compresseurs d'air et pneumatique" },
  { nom: "Matériel de soudure",          categorie: "Équipements et Machines",      description: "Postes à souder, électrodes, fils de soudure et accessoires de soudage" },

  // ─── PRODUITS CHIMIQUES ET PHARMACEUTIQUES ──────────────────────────────────
  { nom: "Produits chimiques industriels", categorie: "Chimie et Pharmacie",        description: "Acides, bases, solvants, réactifs industriels et produits chimiques de base" },
  { nom: "Médicaments et pharma",         categorie: "Chimie et Pharmacie",         description: "Médicaments essentiels, spécialités pharmaceutiques, vaccins et sérums" },
  { nom: "Produits cosmétiques",          categorie: "Chimie et Pharmacie",         description: "Soins de la peau, parfums, produits capillaires, maquillage et hygiène" },
  { nom: "Engrais et fertilisants",       categorie: "Chimie et Pharmacie",         description: "Engrais azotés, phosphatés, potassiques, engrais organiques et amendements" },
  { nom: "Pesticides et phytosanitaires", categorie: "Chimie et Pharmacie",         description: "Herbicides, insecticides, fongicides et produits de protection des cultures" },
  { nom: "Peintures industrielles",       categorie: "Chimie et Pharmacie",         description: "Peintures anticorrosion, époxy, polyuréthane et revêtements industriels" },
  { nom: "Détergents et produits ménagers", categorie: "Chimie et Pharmacie",       description: "Savons, lessives, produits de nettoyage, désinfectants et produits d'hygiène" },

  // ─── TEXTILES ET HABILLEMENT ────────────────────────────────────────────────
  { nom: "Tissus et textiles",            categorie: "Textiles et Habillement",     description: "Tissus wax, coton, polyester, soie, laine et étoffes diverses" },
  { nom: "Vêtements et accessoires",      categorie: "Textiles et Habillement",     description: "Prêt-à-porter homme, femme, enfant, uniformes et vêtements professionnels" },
  { nom: "Chaussures",                    categorie: "Textiles et Habillement",     description: "Chaussures de ville, de sport, de sécurité, sandales et bottes" },
  { nom: "Maroquinerie et bagagerie",     categorie: "Textiles et Habillement",     description: "Sacs, valises, portefeuilles, ceintures et articles en cuir" },
  { nom: "Literie et linge de maison",    categorie: "Textiles et Habillement",     description: "Draps, couvertures, matelas, oreillers, serviettes et rideaux" },

  // ─── ÉLECTRONIQUE ET INFORMATIQUE ───────────────────────────────────────────
  { nom: "Téléphones et tablettes",       categorie: "Électronique et Informatique", description: "Smartphones, tablettes, accessoires téléphoniques et téléphones fixes" },
  { nom: "Ordinateurs et accessoires",    categorie: "Électronique et Informatique", description: "PC, laptops, imprimantes, scanners, périphériques et consommables informatiques" },
  { nom: "Équipements audiovisuels",      categorie: "Électronique et Informatique", description: "Téléviseurs, projecteurs, systèmes audio, caméras et équipements multimédia" },
  { nom: "Électroménagers",               categorie: "Électronique et Informatique", description: "Réfrigérateurs ménagers, lave-linge, micro-ondes, cuisinières et petit électroménager" },
  { nom: "Matériel réseau et télécom",    categorie: "Électronique et Informatique", description: "Routeurs, switches, câbles réseau, antennes et équipements de télécommunication" },
  { nom: "Panneaux solaires et batteries", categorie: "Électronique et Informatique", description: "Panneaux photovoltaïques, batteries solaires, onduleurs solaires et kits énergie" },

  // ─── VÉHICULES ET PIÈCES ────────────────────────────────────────────────────
  { nom: "Véhicules de tourisme",         categorie: "Véhicules et Pièces Détachées", description: "Voitures particulières neuves ou d'occasion, 4x4, berlines et utilitaires légers" },
  { nom: "Véhicules de transport",        categorie: "Véhicules et Pièces Détachées", description: "Camions, semi-remorques, bus, minibus et véhicules de transport de marchandises" },
  { nom: "Motos et tricycles",            categorie: "Véhicules et Pièces Détachées", description: "Motocyclettes, motos-taxis, tricycles de transport et scooters" },
  { nom: "Engins de chantier",            categorie: "Véhicules et Pièces Détachées", description: "Bulldozers, excavatrices, niveleuses, pelles mécaniques et engins de TP" },
  { nom: "Pièces automobiles",            categorie: "Véhicules et Pièces Détachées", description: "Moteurs, boîtes de vitesse, freins, suspensions, carrosserie et accessoires auto" },
  { nom: "Pneus et pneumatiques",         categorie: "Véhicules et Pièces Détachées", description: "Pneus pour véhicules légers, poids lourds, engins et chambres à air" },

  // ─── ÉNERGIE ET COMBUSTIBLES ────────────────────────────────────────────────
  { nom: "Carburants pétroliers",         categorie: "Énergie et Combustibles",     description: "Essence, diesel, kérosène, jet A1 et autres produits pétroliers raffinés" },
  { nom: "Gaz (GPL)",                     categorie: "Énergie et Combustibles",     description: "Gaz propane, butane en bouteilles ou en vrac pour usage domestique et industriel" },
  { nom: "Charbon et bois énergie",       categorie: "Énergie et Combustibles",     description: "Charbon de bois, charbon minéral, bois de chauffe et biomasse combustible" },
  { nom: "Lubrifiants et huiles moteur",  categorie: "Énergie et Combustibles",     description: "Huiles moteur, graisses industrielles, fluides hydrauliques et lubrifiants" },

  // ─── MATIÈRES PREMIÈRES ET MINIÈRES ─────────────────────────────────────────
  { nom: "Minerais et métaux bruts",      categorie: "Matières Premières",          description: "Cuivre, cobalt, cassitérite, coltan, or brut et autres minerais non transformés" },
  { nom: "Métaux précieux",               categorie: "Matières Premières",          description: "Or, argent, platine, diamants et pierres précieuses ou semi-précieuses" },
  { nom: "Bois brut et grumes",           categorie: "Matières Premières",          description: "Grumes, billes de bois, bois équarri, charbon de bois et sous-produits forestiers" },
  { nom: "Caoutchouc naturel",            categorie: "Matières Premières",          description: "Latex, feuilles de caoutchouc, caoutchouc fumé et dérivés naturels" },
  { nom: "Coton et fibres naturelles",    categorie: "Matières Premières",          description: "Coton brut, fibres de jute, sisal, lin et autres fibres végétales" },
  { nom: "Peaux et cuirs bruts",          categorie: "Matières Premières",          description: "Peaux bovines, ovines, caprines, cuirs traités et fourrures" },
  { nom: "Produits agricoles bruts",      categorie: "Matières Premières",          description: "Cacao, café vert, noix de palme, arachides, soja et oléagineux bruts" },

  // ─── MOBILIER ET DÉCORATION ─────────────────────────────────────────────────
  { nom: "Meubles et mobilier",           categorie: "Mobilier et Décoration",      description: "Meubles de bureau, meubles de maison, armoires, tables et chaises" },
  { nom: "Articles de décoration",        categorie: "Mobilier et Décoration",      description: "Tableaux, objets décoratifs, luminaires, tapis et articles d'art" },
  { nom: "Vaisselle et ustensiles",       categorie: "Mobilier et Décoration",      description: "Assiettes, couverts, casseroles, poêles, verrerie et ustensiles de cuisine" },
  { nom: "Articles sanitaires",           categorie: "Mobilier et Décoration",      description: "Baignoires, douches, lavabos, WC et accessoires de salle de bain" },

  // ─── MATÉRIEL MÉDICAL ───────────────────────────────────────────────────────
  { nom: "Équipements médicaux",          categorie: "Matériel Médical",            description: "Appareils de diagnostic, tables d'opération, lits médicaux et équipements de bloc" },
  { nom: "Consommables médicaux",         categorie: "Matériel Médical",            description: "Seringues, gants, masques, bandages, sutures et consommables de soins" },
  { nom: "Réactifs et diagnostics",       categorie: "Matériel Médical",            description: "Réactifs de laboratoire, tests de diagnostic rapide, milieux de culture" },
  { nom: "Matériel dentaire et optique",  categorie: "Matériel Médical",            description: "Équipements dentaires, verres optiques, montures et appareils d'ophtalmologie" },

  // ─── PAPETERIE ET FOURNITURES ───────────────────────────────────────────────
  { nom: "Papeterie et fournitures de bureau", categorie: "Papeterie et Imprimerie", description: "Papier, stylos, classeurs, fournitures scolaires et matériel de bureau" },
  { nom: "Emballages et conditionnement", categorie: "Papeterie et Imprimerie",     description: "Cartons, palettes, films plastique, sachets, boîtes et matériaux d'emballage" },
  { nom: "Imprimerie et supports com.",   categorie: "Papeterie et Imprimerie",     description: "Livres, journaux, supports publicitaires imprimés, enseignes et banderoles" },

  // ─── LOGISTIQUE ET TRANSPORT ────────────────────────────────────────────────
  { nom: "Conteneurs et équipements",     categorie: "Logistique et Transport",     description: "Conteneurs maritimes, palettes, sangles, filets de protection et accessoires logistiques" },
  { nom: "Matériel de froid logistique",  categorie: "Logistique et Transport",     description: "Conteneurs réfrigérés, caisses isothermes, groupes de froid et équipements de chaîne du froid" },
  { nom: "Équipements de sécurité",       categorie: "Logistique et Transport",     description: "EPI (gilets, casques, gants), extincteurs, détecteurs et matériel de sécurité" },

  // ─── DIVERS ─────────────────────────────────────────────────────────────────
  { nom: "Jouets et articles de sport",   categorie: "Divers",                      description: "Jouets, matériel sportif, équipements de fitness et articles de loisirs" },
  { nom: "Instruments de musique",        categorie: "Divers",                      description: "Guitares, claviers, percussions, instruments à vent et accessoires musicaux" },
  { nom: "Animaux vivants",               categorie: "Divers",                      description: "Bovins, ovins, caprins, porcins, volailles et autres animaux d'élevage" },
  { nom: "Colis et envois divers",        categorie: "Divers",                      description: "Marchandises diverses ne rentrant pas dans les autres catégories, colis mixtes" },
];

async function seedCategories() {
  try {
    await sequelize.authenticate();
    console.log("✓ Connexion établie");

    // Créer la table si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" SERIAL PRIMARY KEY,
        "nom" VARCHAR(255) NOT NULL UNIQUE,
        "categorie" VARCHAR(255) NOT NULL,
        "description" TEXT
      )
    `);
    console.log("✓ Table categories prête");

    let inserted = 0;
    let skipped = 0;

    for (const cat of categories) {
      try {
        await sequelize.query(
          `INSERT INTO "categories" ("nom", "categorie", "description")
           VALUES (:nom, :categorie, :description)
           ON CONFLICT ("nom") DO NOTHING`,
          { replacements: cat }
        );
        inserted++;
      } catch (e) {
        console.warn(`  ⚠ Ignoré: ${cat.nom} - ${e.message}`);
        skipped++;
      }
    }

    const [[{ count }]] = await sequelize.query('SELECT COUNT(*) as count FROM "categories"');
    console.log(`\n✓ Terminé : ${inserted} insérées, ${skipped} ignorées`);
    console.log(`✓ Total en base : ${count} catégories\n`);

    // Afficher un résumé par groupe
    const [groups] = await sequelize.query(
      'SELECT "categorie", COUNT(*) as nb FROM "categories" GROUP BY "categorie" ORDER BY "categorie"'
    );
    console.log("=== Résumé par groupe ===");
    groups.forEach(g => console.log(`  ${g.categorie.padEnd(40)} ${g.nb} catégorie(s)`));

  } catch (error) {
    console.error("Erreur:", error.message);
  } finally {
    await sequelize.close();
  }
}

seedCategories();
