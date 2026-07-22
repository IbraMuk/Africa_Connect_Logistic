const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FactureStandard = sequelize.define('FactureStandard', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    comment: 'Identifiant unique de la facture (ex: FAC-2026-0001)'
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID du client facturé'
  },
  dateFacture: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Date de la facture'
  },
  dateEcheance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date d\'échéance de paiement'
  },
  montant: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Montant total de la facture'
  },
  statut: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'En attente',
    validate: {
      isIn: [['En attente', 'Payée', 'En retard', 'Annulée']]
    },
    comment: 'Statut de la facture'
  },
  services: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    comment: 'Liste des services facturés'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes complémentaires'
  }
}, {
  tableName: 'factures_standard',
  timestamps: false
});

module.exports = FactureStandard;
