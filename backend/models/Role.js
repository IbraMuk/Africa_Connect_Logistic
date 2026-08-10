const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif'),
    defaultValue: 'actif'
  }
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'dateCreation',
  updatedAt: 'dateModification'
});

module.exports = Role;
