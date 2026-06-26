const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Billet = sequelize.define(
  "Billet",
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
    typeVoyage: {
      type: DataTypes.ENUM("aller_simple", "aller_retour"),
      allowNull: false,
    },
    typeTransport: {
      type: DataTypes.ENUM("bus", "train", "avion", "bateau"),
      allowNull: false,
    },
    numeroVol: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    compagnie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    depart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    arrivee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateHeureDepart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateHeureArrivee: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateHeureDepartRetour: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dateHeureArriveeRetour: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    classe: {
      type: DataTypes.ENUM("economique", "business", "premiere"),
      defaultValue: "economique",
    },
    numeroSiege: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passagers: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    prix: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    taxes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    fraisService: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    prixTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    statut: {
      type: DataTypes.ENUM(
        "réservé",
        "confirmé",
        "checké",
        "embarqué",
        "annulé",
        "remboursé",
      ),
      defaultValue: "réservé",
    },
    paiementStatut: {
      type: DataTypes.ENUM("en_attente", "payé", "remboursé"),
      defaultValue: "en_attente",
    },
    referenceReservation: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    codeConfirmation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bagages: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    servicesSupplementaires: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    indexes: [
      {
        fields: ["clientId"],
      },
      {
        fields: ["referenceReservation"],
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

module.exports = Billet;
