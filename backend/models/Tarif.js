const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Tarif = sequelize.define(
  "Tarif",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itineraireId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID de l'itinéraire",
    },
    classe: {
      type: DataTypes.ENUM("economique", "standard", "business", "vip"),
      allowNull: false,
      comment: "Classe de tarif",
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Prix du tarif",
    },
    devise: {
      type: DataTypes.STRING(10),
      defaultValue: "USD",
      comment: "Devise",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description du tarif",
    },
    servicesInclus: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Services inclus dans le tarif",
    },
    statut: {
      type: DataTypes.ENUM("actif", "inactif"),
      defaultValue: "actif",
      comment: "Statut du tarif",
    },
  },
  {
    tableName: "tarifs",
    timestamps: true,
    createdAt: "dateCreation",
    updatedAt: "dateModification",
    indexes: [
      {
        fields: ["itineraireId"],
      },
      {
        fields: ["classe"],
      },
      {
        fields: ["statut"],
      },
    ],
  }
);

module.exports = Tarif;
