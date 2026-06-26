const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Facture = sequelize.define('Facture', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `FAC-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    }
  },
  dateFacture: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dateEcheance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('En attente', 'Payée', 'En retard', 'Annulée'),
    defaultValue: 'En attente'
  },
  services: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'factures',
  timestamps: false
});

module.exports = Facture;
