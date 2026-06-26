const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect to PostgreSQL default database (postgres)
const sequelize = new Sequelize(`postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`, {
  dialect: 'postgres',
  logging: console.log
});

async function createDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await sequelize.authenticate();
    console.log('Connected successfully!');
    
    console.log('Creating database africa_connect_logistic...');
    await sequelize.query('CREATE DATABASE africa_connect_logistic');
    console.log('Database created successfully!');
    
    await sequelize.close();
    console.log('Done! You can now run npm start');
  } catch (error) {
    if (error.original?.code === '42P04') {
      console.log('Database already exists!');
    } else {
      console.error('Error:', error.message);
    }
    await sequelize.close();
  }
}

createDatabase();
