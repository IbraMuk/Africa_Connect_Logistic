const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ImportExport = sequelize.define(
  "ImportExport",
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
    typeOperation: {
      type: DataTypes.ENUM("import", "export", "transit"),
      allowNull: false,
    },
    numeroDeclaration: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    paysOrigine: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paysDestination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    portDepart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    portArrivee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeMarchandise: {
      type: DataTypes.ENUM(
        "general",
        "dangerux",
        "perissable",
        "electronique",
        "vehicule",
        "textile",
        "agricole",
      ),
      allowNull: false,
    },
    descriptionDetaillee: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    poidsTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    volumeTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    nombreConteneurs: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    typeConteneurs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    incoterms: {
      type: DataTypes.ENUM(
        "EXW",
        "FCA",
        "FAS",
        "FOB",
        "CFR",
        "CIF",
        "CPT",
        "CIP",
        "DAP",
        "DPU",
        "DPP",
        "DDP",
      ),
      allowNull: false,
    },
    modeTransport: {
      type: DataTypes.ENUM(
        "maritime",
        "aerien",
        "routier",
        "ferroviaire",
        "multimodal",
      ),
      allowNull: false,
    },
    dateExpedition: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateArriveePrevue: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dateArriveeReelle: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    valeurMarchandise: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    devise: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
    coutTransport: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    coutDouane: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    coutAssurance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
    },
    coutTotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    statut: {
      type: DataTypes.ENUM(
        "préparation",
        "douane_sortie",
        "en_transit",
        "douane_arrivée",
        "livraison",
        "terminé",
        "annulé",
      ),
      defaultValue: "préparation",
    },
    documents: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    certificats: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    numeroSuivi: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
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
        fields: ["typeOperation"],
      },
      {
        fields: ["statut"],
      },
      {
        fields: ["numeroSuivi"],
      },
      {
        fields: ["dateExpedition"],
      },
    ],
  },
);

module.exports = ImportExport;
