const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Nom de la catégorie (ex: Référence générique)'
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom de la catégorie de marchandise'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description détaillée de la catégorie'
  }
}, {
  tableName: 'categories',
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['nom', 'categorie']
    },
    {
      fields: ['categorie']
    }
  ]
});

// Définir les associations
Category.associate = (models) => {
  Category.hasMany(models.Marchandise, {
    foreignKey: 'categorieId',
    as: 'marchandises'
  });
};

module.exports = Category;
