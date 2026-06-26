const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('Particulier', 'Entreprise'),
    defaultValue: 'Particulier'
  },
  statut: {
    type: DataTypes.ENUM('Actif', 'Inactif'),
    defaultValue: 'Actif'
  },
  dateInscription: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'dateInscription'
  }
}, {
  tableName: 'clients',
  timestamps: false,
  createdAt: false,
  updatedAt: false
});

module.exports = Client;
