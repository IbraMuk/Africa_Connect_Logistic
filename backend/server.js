require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database");

// Charger tous les modèles et leurs associations
require("./models/index");

// Importer les routes
const authRoutes = require("./routes/auth");
const personnelRoutes = require("./routes/personnel");
const marchandiseRoutes = require("./routes/marchandise");
const marchandisesRoutes = require("./routes/marchandises-pg");
const categoriesRoutes = require("./routes/categories");
const billetRoutes = require("./routes/billet");
const importExportRoutes = require("./routes/importExport");
const clientRoutes = require("./routes/clients");
const factureRoutes = require("./routes/factures");
const itinerairesRoutes = require("./routes/itineraires");
const maintenancesRoutes = require("./routes/maintenances");
const approvisionnementsRoutes = require("./routes/approvisionnements");
const carburantsRoutes = require("./routes/carburants");
const rapportsRoutes = require("./routes/rapports");
const tarifsRoutes = require("./routes/tarifs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, "http://localhost:3000"]
    : "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/personnel", personnelRoutes);
app.use("/api/marchandise", marchandiseRoutes);
app.use("/api/marchandises", marchandisesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/billet", billetRoutes);
app.use("/api/import-export", importExportRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/factures", factureRoutes);
app.use("/api/itineraires", itinerairesRoutes);
app.use("/api/maintenances", maintenancesRoutes);
app.use("/api/approvisionnements", approvisionnementsRoutes);
app.use("/api/carburants", carburantsRoutes);
app.use("/api/rapports", rapportsRoutes);
app.use("/api/tarifs", tarifsRoutes);

// Route racine
app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Africa Connect Logistic",
    version: "1.0.0",
    modules: [
      "Transport du personnel",
      "Transport de marchandises",
      "Réservation de billets",
      "Import/Export",
    ],
  });
});

// Gestion des erreurs 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    message: `La route ${req.originalUrl} n'existe pas`,
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Erreur serveur",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Une erreur est survenue",
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✓ Connexion à la base de données établie");

    // Créer la table clients si elle n'existe pas (avant factures pour la clé étrangère)
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "clients" (
        "id" SERIAL PRIMARY KEY,
        "nom" VARCHAR(255) NOT NULL,
        "prenom" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "telephone" VARCHAR(20),
        "adresse" TEXT,
        "ville" VARCHAR(255),
        "pays" VARCHAR(255),
        "type" VARCHAR(20) NOT NULL DEFAULT 'particulier' CHECK ("type" IN ('particulier','entreprise','gouvernement','autre')),
        "statut" VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK ("statut" IN ('actif','inactif','suspendu')),
        "dateInscription" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table factures_standard (factures classiques par client) si elle n'existe pas encore
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "factures_standard" (
        "id" VARCHAR(255) NOT NULL PRIMARY KEY,
        "clientId" INTEGER NOT NULL REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
        "dateFacture" DATE NOT NULL DEFAULT CURRENT_DATE,
        "dateEcheance" DATE NOT NULL,
        "montant" DECIMAL(10,2) NOT NULL,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'En attente' CHECK ("statut" IN ('En attente','Payée','En retard','Annulée')),
        "services" JSONB NOT NULL DEFAULT '[]',
        "notes" TEXT
      )
    `);

    // Créer la table itineraires si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "itineraires" (
        "id" SERIAL PRIMARY KEY,
        "nom" VARCHAR(255) NOT NULL,
        "pointDepart" VARCHAR(255) NOT NULL,
        "pointArrivee" VARCHAR(255) NOT NULL,
        "distance" DECIMAL(10,2),
        "dureeEstimee" DECIMAL(5,2),
        "description" TEXT,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK ("statut" IN ('actif','inactif','suspendu')),
        "typeTransport" VARCHAR(20) NOT NULL DEFAULT 'routier' CHECK ("typeTransport" IN ('routier','ferroviaire','fluvial','aérien','mixte')),
        "zonesTraversees" JSONB DEFAULT '[]',
        "prixBase" DECIMAL(10,2),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table maintenances si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "maintenances" (
        "id" SERIAL PRIMARY KEY,
        "equipement" VARCHAR(255) NOT NULL,
        "typeMaintenance" VARCHAR(20) NOT NULL DEFAULT 'corrective' CHECK ("typeMaintenance" IN ('preventive','corrective','curative','urgence')),
        "description" TEXT NOT NULL,
        "dateDebut" DATE NOT NULL,
        "dateFin" DATE,
        "cout" DECIMAL(10,2),
        "technicien" VARCHAR(255),
        "statut" VARCHAR(20) NOT NULL DEFAULT 'en_attente' CHECK ("statut" IN ('en_attente','en_cours','terminee','annulee')),
        "priorite" VARCHAR(20) NOT NULL DEFAULT 'moyenne' CHECK ("priorite" IN ('basse','moyenne','haute','critique')),
        "observations" TEXT,
        "piecesRemplacees" JSONB DEFAULT '[]',
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table approvisionnements si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "approvisionnements" (
        "id" SERIAL PRIMARY KEY,
        "reference" VARCHAR(255) NOT NULL UNIQUE,
        "fournisseur" VARCHAR(255) NOT NULL,
        "article" VARCHAR(255) NOT NULL,
        "categorie" VARCHAR(255),
        "quantite" DECIMAL(10,2) NOT NULL,
        "unite" VARCHAR(50),
        "prixUnitaire" DECIMAL(10,2) NOT NULL,
        "montantTotal" DECIMAL(10,2),
        "dateCommande" DATE NOT NULL,
        "dateLivraisonPrevue" DATE,
        "dateLivraisonReelle" DATE,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'en_attente' CHECK ("statut" IN ('en_attente','commandee','en_transit','livree','annulee','partielle')),
        "modePaiement" VARCHAR(20) NOT NULL DEFAULT 'credit' CHECK ("modePaiement" IN ('cash','credit','virement','cheque')),
        "statutPaiement" VARCHAR(20) NOT NULL DEFAULT 'en_attente' CHECK ("statutPaiement" IN ('en_attente','partielle','payee')),
        "notes" TEXT,
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table carburants si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "carburants" (
        "id" SERIAL PRIMARY KEY,
        "vehicule" VARCHAR(255) NOT NULL,
        "typeCarburant" VARCHAR(20) NOT NULL CHECK ("typeCarburant" IN ('essence','diesel','gpl','electrique','hybride')),
        "quantite" DECIMAL(10,2) NOT NULL,
        "prixUnitaire" DECIMAL(10,2) NOT NULL,
        "montantTotal" DECIMAL(10,2),
        "date" DATE NOT NULL,
        "station" VARCHAR(255),
        "kilometrage" INTEGER,
        "chauffeur" VARCHAR(255),
        "typePaiement" VARCHAR(20) NOT NULL DEFAULT 'credit' CHECK ("typePaiement" IN ('cash','carte','credit','prepaye')),
        "notes" TEXT,
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table tarifs si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "tarifs" (
        "id" SERIAL PRIMARY KEY,
        "itineraireId" INTEGER NOT NULL,
        "classe" VARCHAR(20) NOT NULL CHECK ("classe" IN ('economique','standard','business','vip')),
        "prix" DECIMAL(10,2) NOT NULL,
        "devise" VARCHAR(10) DEFAULT 'USD',
        "description" TEXT,
        "servicesInclus" JSONB DEFAULT '[]',
        "statut" VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK ("statut" IN ('actif','inactif')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table categories si elle n'existe pas
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

    // Créer la table marchandises si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "marchandises" (
        "id" SERIAL PRIMARY KEY,
        "reference" VARCHAR(255) UNIQUE NOT NULL,
        "designation" VARCHAR(255) NOT NULL,
        "categoriePrincipale" VARCHAR(50) NOT NULL DEFAULT 'Fini' CHECK ("categoriePrincipale" IN ('Matière première','Semi-fini','Fini','Spécial')),
        "categorieId" INTEGER,
        "codeHS" VARCHAR(10),
        "poids" DECIMAL(10,2) NOT NULL,
        "volume" DECIMAL(10,3) NOT NULL,
        "quantite" DECIMAL(12,2),
        "unite" VARCHAR(20) DEFAULT 'kg' CHECK ("unite" IN ('kg','tonne','m3','litre','unité','carton','palette')),
        "valeurMarchande" DECIMAL(15,2),
        "devise" VARCHAR(10) DEFAULT 'USD' CHECK ("devise" IN ('USD','EUR','CDF','XAF','XOF')),
        "expediteurId" INTEGER NOT NULL,
        "destinataireNom" VARCHAR(255) NOT NULL,
        "destinataireTelephone" VARCHAR(255) NOT NULL,
        "destinataireEmail" VARCHAR(255),
        "destinataireAdresse" TEXT,
        "paysOrigine" VARCHAR(100),
        "paysDestination" VARCHAR(100),
        "villeDepart" VARCHAR(255) NOT NULL,
        "villeArrivee" VARCHAR(255) NOT NULL,
        "adresseRamassage" TEXT,
        "adresseLivraison" TEXT,
        "dateEnvoi" DATE NOT NULL DEFAULT CURRENT_DATE,
        "dateLivraisonPrevue" DATE,
        "dateLivraisonReelle" DATE,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'En attente' CHECK ("statut" IN ('En attente','En transit','Livré','Retardé','Perdu')),
        "priorite" VARCHAR(20) NOT NULL DEFAULT 'Normale' CHECK ("priorite" IN ('Basse','Normale','Haute','Urgente')),
        "typeTransport" VARCHAR(20) NOT NULL DEFAULT 'Routier' CHECK ("typeTransport" IN ('Routier','Aérien','Maritime','Ferroviaire')),
        "exigencesReglementaires" TEXT,
        "conditionsStockage" TEXT,
        "documentsAssocies" TEXT,
        "instructionsSpeciales" TEXT,
        "observations" TEXT,
        "valeurDeclaree" DECIMAL(12,2),
        "assurance" BOOLEAN DEFAULT false,
        "numeroSuivi" VARCHAR(255) UNIQUE,
        "chauffeurId" INTEGER,
        "vehiculeId" INTEGER,
        "coutTransport" DECIMAL(10,2),
        "reglementStatut" VARCHAR(20) NOT NULL DEFAULT 'Non payé' CHECK ("reglementStatut" IN ('Non payé','Partiellement payé','Payé')),
        "createdById" INTEGER
      )
    `);

    // Créer la table transport_marchandises si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "transport_marchandises" (
        "id" SERIAL PRIMARY KEY,
        "marchandiseId" INTEGER,
        "itineraireId" INTEGER,
        "dateDepart" DATE NOT NULL,
        "dateArrivee" DATE,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'en_attente' CHECK ("statut" IN ('en_attente','en_cours','livree','annulee','retard')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table transport_personnels si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "transport_personnels" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER,
        "itineraireId" INTEGER,
        "dateReservation" DATE NOT NULL,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'reserve' CHECK ("statut" IN ('reserve','confirme','annule','termine')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table billets si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "billets" (
        "id" SERIAL PRIMARY KEY,
        "transportPersonnelId" INTEGER,
        "tarifId" INTEGER,
        "numero" VARCHAR(255) UNIQUE NOT NULL,
        "dateEmission" DATE NOT NULL,
        "statut" VARCHAR(20) NOT NULL DEFAULT 'valide' CHECK ("statut" IN ('valide','utilise','annule','expire')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table import_exports si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "import_exports" (
        "id" SERIAL PRIMARY KEY,
        "type" VARCHAR(20) NOT NULL CHECK ("type" IN ('import','export')),
        "marchandiseId" INTEGER,
        "paysOrigine" VARCHAR(255),
        "paysDestination" VARCHAR(255),
        "dateOperation" DATE NOT NULL,
        "valeur" DECIMAL(15,2),
        "statut" VARCHAR(20) NOT NULL DEFAULT 'en_cours' CHECK ("statut" IN ('en_cours','termine','annule','retard')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table factures si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "factures" (
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

    // Créer la table facture_marchandises si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "facture_marchandises" (
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

    // Créer la table users si elle n'existe pas
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "nom" VARCHAR(255) NOT NULL,
        "prenom" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "motdepasse" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'utilisateur' CHECK ("role" IN ('admin','utilisateur','client','chauffeur')),
        "statut" VARCHAR(20) NOT NULL DEFAULT 'actif' CHECK ("statut" IN ('actif','inactif','suspendu')),
        "dateCreation" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "dateModification" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✓ Tables vérifiées");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Serveur démarré sur le port ${PORT}`);
      console.log(`  API disponible à http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Impossible de démarrer le serveur:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
