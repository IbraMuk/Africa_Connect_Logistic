const { Sequelize } = require("sequelize");
require("dotenv").config();

// Encoder le mot de passe pour les caractères spéciaux
const encodedPassword = encodeURIComponent(process.env.DB_PASSWORD || "");
const sequelize = new Sequelize(
  `postgresql://${process.env.DB_USER}:${encodedPassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: "postgres",
    logging: false,
  },
);

// Importer tous les modèles
const models = require("./models");
const { User } = models;

async function syncDatabase() {
  try {
    console.log("Synchronisation de la base de données...");

    // Créer toutes les tables
    await sequelize.sync({ force: false });
    console.log("Tables créées avec succès!");

    // Vérifier s'il y a des utilisateurs
    const userCount = await User.count();
    console.log(`\nNombre d'utilisateurs dans la base: ${userCount}`);

    if (userCount === 0) {
      console.log("\nAucun utilisateur trouvé. Vous devez créer un compte.");
      console.log("Utilisez POST /api/auth/register pour créer un compte.");
    } else {
      // Afficher les utilisateurs existants
      const users = await User.findAll({
        attributes: ["id", "nom", "prenom", "email", "role", "createdAt"],
      });
      console.log("\nUtilisateurs existants :");
      console.table(users.map((u) => u.toJSON()));
    }

    await sequelize.close();
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error.message);
    await sequelize.close();
  }
}

syncDatabase();
