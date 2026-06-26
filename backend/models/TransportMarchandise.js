const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TransportMarchandise = sequelize.define(
  "TransportMarchandise",
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
    typeMarchandise: {
      type: DataTypes.ENUM(
        "standard",
        "fragile",
        "dangereux",
        "perissable",
        "lourde",
        "volumineux",
      ),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    poids: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    volume: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    pointEnlevement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    pointLivraison: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    dateEnlevement: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateLivraisonPrevue: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateLivraisonReelle: {
      type: DataTypes.DATE,
      allowNull: true,
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
        "en_levement",
        "en_transit",
        "livré",
        "annulé",
      ),
      defaultValue: "en_attente",
    },
    paiementStatut: {
      type: DataTypes.ENUM("en_attente", "payé", "remboursé"),
      defaultValue: "en_attente",
    },
    assurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    valeurAssurance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    instructionsSpeciales: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
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
        fields: ["dateEnlevement"],
      },
    ],
  },
);

module.exports = TransportMarchandise;
