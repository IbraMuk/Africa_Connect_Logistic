const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Approvisionnement = sequelize.define(
  "Approvisionnement",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "Référence unique de l'approvisionnement",
    },
    fournisseur: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nom du fournisseur",
    },
    article: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Nom de l'article",
    },
    categorie: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Catégorie de l'article",
    },
    quantite: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Quantité commandée",
    },
    unite: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Unité de mesure (kg, litre, pièce, etc.)",
    },
    prixUnitaire: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Prix unitaire",
    },
    montantTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Montant total (quantité × prix unitaire)",
    },
    dateCommande: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date de la commande",
    },
    dateLivraisonPrevue: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de livraison prévue",
    },
    dateLivraisonReelle: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de livraison réelle",
    },
    statut: {
      type: DataTypes.ENUM("en_attente", "commandee", "en_transit", "livree", "annulee", "partielle"),
      defaultValue: "en_attente",
      comment: "Statut de l'approvisionnement",
    },
    modePaiement: {
      type: DataTypes.ENUM("cash", "credit", "virement", "cheque"),
      defaultValue: "credit",
      comment: "Mode de paiement",
    },
    statutPaiement: {
      type: DataTypes.ENUM("en_attente", "partielle", "payee"),
      defaultValue: "en_attente",
      comment: "Statut du paiement",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Notes supplémentaires",
    },
  },
  {
    tableName: "approvisionnements",
    timestamps: true,
    createdAt: "dateCreation",
    updatedAt: "dateModification",
    indexes: [
      {
        fields: ["fournisseur"],
      },
      {
        fields: ["statut"],
      },
      {
        fields: ["dateCommande"],
      },
      {
        fields: ["reference"],
      },
    ],
  }
);

module.exports = Approvisionnement;
