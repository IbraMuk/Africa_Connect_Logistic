const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Maintenance = sequelize.define(
  "Maintenance",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipement: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nom de l'équipement ou véhicule",
    },
    typeMaintenance: {
      type: DataTypes.ENUM("preventive", "corrective", "curative", "urgence"),
      defaultValue: "corrective",
      comment: "Type de maintenance",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Description de la maintenance",
    },
    dateDebut: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date de début de la maintenance",
    },
    dateFin: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de fin de la maintenance",
    },
    cout: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Coût de la maintenance",
    },
    technicien: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Nom du technicien",
    },
    statut: {
      type: DataTypes.ENUM("en_attente", "en_cours", "terminee", "annulee"),
      defaultValue: "en_attente",
      comment: "Statut de la maintenance",
    },
    priorite: {
      type: DataTypes.ENUM("basse", "moyenne", "haute", "critique"),
      defaultValue: "moyenne",
      comment: "Priorité de la maintenance",
    },
    observations: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Observations après maintenance",
    },
    piecesRemplacees: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Liste des pièces remplacées",
    },
  },
  {
    tableName: "maintenances",
    timestamps: true,
    createdAt: "dateCreation",
    updatedAt: "dateModification",
    indexes: [
      {
        fields: ["equipement"],
      },
      {
        fields: ["statut"],
      },
      {
        fields: ["dateDebut"],
      },
      {
        fields: ["priorite"],
      },
    ],
  }
);

module.exports = Maintenance;
