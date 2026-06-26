const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Carburant = sequelize.define(
  "Carburant",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vehicule: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nom ou plaque d'immatriculation du véhicule",
    },
    typeCarburant: {
      type: DataTypes.ENUM("essence", "diesel", "gpl", "electrique", "hybride"),
      allowNull: false,
      comment: "Type de carburant",
    },
    quantite: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Quantité en litres",
    },
    prixUnitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Prix unitaire par litre",
    },
    montantTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Montant total",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date du ravitaillement",
    },
    station: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Station service",
    },
    kilometrage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Kilométrage du véhicule",
    },
    chauffeur: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nom du chauffeur",
    },
    typePaiement: {
      type: DataTypes.ENUM("cash", "carte", "credit", "prepaye"),
      defaultValue: "credit",
      comment: "Mode de paiement",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes supplémentaires",
    },
  },
  {
    tableName: "carburants",
    timestamps: true,
    createdAt: "dateCreation",
    updatedAt: "dateModification",
    indexes: [
      {
        fields: ["vehicule"],
      },
      {
        fields: ["date"],
      },
      {
        fields: ["typeCarburant"],
      },
    ],
  }
);

module.exports = Carburant;
