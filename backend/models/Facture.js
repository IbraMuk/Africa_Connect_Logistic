const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Facture = sequelize.define('Facture', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numeroFacture: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Numéro unique de la facture'
  },
  typeOperation: {
    type: DataTypes.ENUM('import', 'export'),
    allowNull: false,
    comment: 'Type d\'opération (import ou export)'
  },
  dateFacture: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Date de la facture'
  },
  dateEcheance: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date d\'échéance de paiement'
  },
  clientNom: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom du client'
  },
  clientEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Email du client'
  },
  clientTelephone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Téléphone du client'
  },
  clientAdresse: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Adresse du client'
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Instructions spéciales'
  },
  totalHT: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Total hors taxes'
  },
  totalTVA: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Total TVA'
  },
  totalTTC: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Total toutes taxes comprises'
  },
  totalPoids: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Poids total des marchandises'
  },
  totalVolume: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Volume total des marchandises'
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'payee', 'annulee'),
    defaultValue: 'en_attente',
    comment: 'Statut de la facture'
  }
}, {
  tableName: 'factures',
  timestamps: true,
  createdAt: 'dateCreation',
  updatedAt: 'dateModification',
  indexes: [
    {
      unique: true,
      fields: ['numeroFacture']
    },
    {
      fields: ['typeOperation']
    },
    {
      fields: ['statut']
    },
    {
      fields: ['dateFacture']
    }
  ]
});

module.exports = Facture;
