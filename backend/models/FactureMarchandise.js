const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FactureMarchandise = sequelize.define('FactureMarchandise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  factureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'factures',
      key: 'id'
    },
    comment: 'ID de la facture'
  },
  marchandiseId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID de la marchandise originale'
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Référence de la marchandise'
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Désignation de la marchandise'
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Catégorie de la marchandise'
  },
  quantite: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Quantité facturée'
  },
  poids: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Poids unitaire'
  },
  volume: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Volume unitaire'
  },
  prixUnitaire: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Prix unitaire'
  },
  montantTotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    comment: 'Montant total pour cette ligne'
  }
}, {
  tableName: 'facture_marchandises',
  timestamps: true,
  createdAt: 'dateCreation',
  updatedAt: false,
  indexes: [
    {
      fields: ['factureId']
    },
    {
      fields: ['marchandiseId']
    }
  ]
});

module.exports = FactureMarchandise;
