const { Sequelize } = require("sequelize");
require("dotenv").config();

// Connect to your database
const sequelize = new Sequelize(
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    dialect: "postgres",
    logging: false,
  },
);

async function checkUsers() {
  try {
    // Check if users table exists and show users
    const [results] = await sequelize.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);

    if (results.length === 0) {
      console.log('La table "users" n\'existe pas encore.');
    } else {
      console.log("Structure de la table users :");
      console.table(results);

      // Show all users
      const users = await sequelize.query(
        "SELECT id, nom, prenom, email, role FROM users",
        {
          type: Sequelize.QueryTypes.SELECT,
        },
      );

      if (users.length === 0) {
        console.log("\nAucun utilisateur trouvé dans la base de données.");
      } else {
        console.log("\nUtilisateurs trouvés :");
        console.table(users);
      }
    }

    await sequelize.close();
  } catch (error) {
    console.error("Erreur :", error.message);
    await sequelize.close();
  }
}

checkUsers();
