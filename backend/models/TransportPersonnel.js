const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TransportPersonnel = sequelize.define(
  "TransportPersonnel",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    chauffeurId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    typeTransport: {
      type: DataTypes.ENUM("navette", "vip", "collectif", "individuel"),
      allowNull: false,
    },
    pointDepart: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    pointArrivee: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    dateHeureDepart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateHeureArrivee: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nombrePersonnes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 50,
      },
    },
    informationsPassagers: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    vehicule: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    immatriculation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    statut: {
      type: DataTypes.ENUM(
        "en_attente",
        "confirmé",
        "en_cours",
        "terminé",
        "annulé",
      ),
      defaultValue: "en_attente",
    },
    paiementStatut: {
      type: DataTypes.ENUM("en_attente", "payé", "remboursé"),
      defaultValue: "en_attente",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "transport_personnel",
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    indexes: [
      {
        fields: ["clientId"],
      },
      {
        fields: ["chauffeurId"],
      },
      {
        fields: ["statut"],
      },
      {
        fields: ["dateHeureDepart"],
      },
    ],
  },
);

module.exports = TransportPersonnel;
