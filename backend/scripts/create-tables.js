const { Pool } = require('pg');

// Configuration de la connexion
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'africa_connect_logistic',
  password: 'Admin@123',
  port: 5432,
});

async function createTables() {
  try {
    console.log('Connexion à la base de données PostgreSQL...');
    
    // Test de connexion
    const client = await pool.connect();
    console.log('✅ Connexion réussie!');
    
    // Création de la table users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table users créée!');
    
    // Création de la table clients
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        adresse TEXT,
        type VARCHAR(20) DEFAULT 'Particulier',
        statut VARCHAR(20) DEFAULT 'Actif',
        "dateInscription" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table clients créée!');
    
    // Création de la table personnel
    await client.query(`
      CREATE TABLE IF NOT EXISTS personnel (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        telephone VARCHAR(20) NOT NULL,
        poste VARCHAR(100) NOT NULL,
        permis VARCHAR(50),
        statut VARCHAR(20) DEFAULT 'Disponible',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table personnel créée!');
    
    // Création de la table marchandises
    await client.query(`
      CREATE TABLE IF NOT EXISTS marchandises (
        id SERIAL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        description TEXT,
        poids DECIMAL(10,2),
        volume DECIMAL(10,2),
        type VARCHAR(50),
        statut VARCHAR(20) DEFAULT 'En attente',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table marchandises créée!');
    
    // Création de la table billets
    await client.query(`
      CREATE TABLE IF NOT EXISTS billets (
        id SERIAL PRIMARY KEY,
        depart VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        dateDepart TIMESTAMP NOT NULL,
        prix DECIMAL(10,2) NOT NULL,
        placesDisponibles INTEGER DEFAULT 0,
        statut VARCHAR(20) DEFAULT 'Disponible',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table billets créée!');
    
    // Création de la table import_exports
    await client.query(`
      CREATE TABLE IF NOT EXISTS import_exports (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        description TEXT NOT NULL,
        provenance VARCHAR(100),
        destination VARCHAR(100),
        valeurDouane DECIMAL(12,2),
        statut VARCHAR(20) DEFAULT 'En cours',
        documents TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table import_exports créée!');
    
    // Afficher les tables créées
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tables dans la base de données:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('\n✅ Base de données initialisée avec succès!');
    
    client.release();
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error.message);
  } finally {
    await pool.end();
  }
}

// Exécuter la création des tables
createTables();
