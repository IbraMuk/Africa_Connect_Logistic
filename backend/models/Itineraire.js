const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Itineraire = sequelize.define(
  "Itineraire",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nom de l'itinéraire",
    },
    pointDepart: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Point de départ",
    },
    pointArrivee: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Point d'arrivée",
    },
    distance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Distance en km",
    },
    dureeEstimee: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: "Durée estimée en heures",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description de l'itinéraire",
    },
    statut: {
      type: DataTypes.ENUM("actif", "inactif", "suspendu"),
      defaultValue: "actif",
      comment: "Statut de l'itinéraire",
    },
    typeTransport: {
      type: DataTypes.ENUM("routier", "ferroviaire", "fluvial", "aérien", "mixte"),
      defaultValue: "routier",
      comment: "Type de transport",
    },
    zonesTraversees: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Liste des zones traversées",
    },
    prixBase: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Prix de base du transport",
    },
  },
  {
    tableName: "itineraires",
    timestamps: true,
    createdAt: "dateCreation",
    updatedAt: "dateModification",
    indexes: [
      {
        fields: ["pointDepart"],
      },
      {
        fields: ["pointArrivee"],
      },
      {
        fields: ["statut"],
      },
    ],
  }
);

module.exports = Itineraire;
