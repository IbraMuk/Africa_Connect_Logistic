// Script pour initialiser la base de données
require('dotenv').config();

// Modifier temporairement le mot de passe dans process.env pour éviter le problème d'encodage
const originalPassword = process.env.DB_PASSWORD;
process.env.DB_PASSWORD = encodeURIComponent(originalPassword);

console.log('Initialisation de la base de données...');

// Importer après la modification du mot de passe
const { sequelize } = require('./config/database');
const { User } = require('./models');

async function initDatabase() {
  try {
    // Synchroniser la base de données
    await sequelize.sync({ force: false });
    console.log('✓ Tables créées avec succès!');
    
    // Vérifier les utilisateurs existants
    const users = await User.findAll({
      attributes: ['id', 'nom', 'prenom', 'email', 'role', 'createdAt']
    });
    
    if (users.length === 0) {
      console.log('\n❌ Aucun utilisateur trouvé.');
      console.log('Vous devez créer un compte en utilisant l\'API:');
      console.log('POST http://localhost:5000/api/auth/register');
      console.log('\nExemple de requête:');
      console.log(JSON.stringify({
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@email.com",
        password: "password123",
        role: "client"
      }, null, 2));
    } else {
      console.log(`\n✓ ${users.length} utilisateur(s) trouvé(s):`);
      console.table(users.map(u => ({
        ID: u.id,
        Nom: u.nom,
        Prénom: u.prenom,
        Email: u.email,
        Rôle: u.role,
        'Date création': u.createdAt.toLocaleString('fr-FR')
      })));
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await sequelize.close();
    // Restaurer le mot de passe original
    process.env.DB_PASSWORD = originalPassword;
  }
}

initDatabase();
