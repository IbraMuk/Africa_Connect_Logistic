const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Marchandise = sequelize.define('Marchandise', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Référence unique du colis (ex: MAR-2024-001)'
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Description de la marchandise'
  },
  categoriePrincipale: {
    type: DataTypes.ENUM('Matière première', 'Semi-fini', 'Fini', 'Spécial'),
    allowNull: false,
    defaultValue: 'Fini',
    comment: 'Catégorie principale de la marchandise'
  },
  categorieId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id'
    },
    comment: 'ID de la catégorie (référence à la table categories)'
  },
  codeHS: {
    type: DataTypes.STRING(10),
    allowNull: true,
    comment: 'Code douanier HS (6 à 10 chiffres)'
  },
  poids: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Poids en kg'
  },
  volume: {
    type: DataTypes.DECIMAL(10, 3),
    allowNull: false,
    comment: 'Volume en m³'
  },
  quantite: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Quantité (volume, poids ou nombre d\'unités)'
  },
  unite: {
    type: DataTypes.ENUM('kg', 'tonne', 'm3', 'litre', 'unité', 'carton', 'palette'),
    allowNull: false,
    defaultValue: 'kg',
    comment: 'Unité de mesure'
  },
  valeurMarchande: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Valeur marchande'
  },
  devise: {
    type: DataTypes.ENUM('USD', 'EUR', 'CDF', 'XAF', 'XOF'),
    allowNull: false,
    defaultValue: 'USD',
    comment: 'Devise de la valeur marchande'
  },
  expediteurId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'clients',
      key: 'id'
    },
    comment: 'ID du client expéditeur'
  },
  destinataireNom: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nom du destinataire'
  },
  destinataireTelephone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Téléphone du destinataire'
  },
  destinataireEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    },
    comment: 'Email du destinataire'
  },
  destinataireAdresse: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Adresse complète du destinataire'
  },
  paysOrigine: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Pays d\'expédition / production'
  },
  paysDestination: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Pays de livraison / client final'
  },
  villeDepart: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ville de départ'
  },
  villeArrivee: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Ville de destination'
  },
  adresseRamassage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Adresse de ramassage'
  },
  adresseLivraison: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Adresse de livraison'
  },
  dateEnvoi: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: 'Date d\'envoi prévue'
  },
  dateLivraisonPrevue: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date de livraison prévue'
  },
  dateLivraisonReelle: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date de livraison réelle'
  },
  statut: {
    type: DataTypes.ENUM('En attente', 'En transit', 'Livré', 'Retardé', 'Perdu'),
    defaultValue: 'En attente',
    comment: 'Statut de la marchandise'
  },
  priorite: {
    type: DataTypes.ENUM('Basse', 'Normale', 'Haute', 'Urgente'),
    defaultValue: 'Normale',
    comment: 'Priorité de livraison'
  },
  typeTransport: {
    type: DataTypes.ENUM('Routier', 'Aérien', 'Maritime', 'Ferroviaire'),
    defaultValue: 'Routier',
    comment: 'Type de transport'
  },
  exigencesReglementaires: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Exigences réglementaires (certificat sanitaire, licence d\'importation, ADR, phytosanitaire, etc.)'
  },
  conditionsStockage: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Conditions de stockage (chaîne du froid, entrepôt sec, zone sécurisée)'
  },
  documentsAssocies: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Documents associés (facture commerciale, certificat d\'origine, connaissement, assurance)'
  },
  instructionsSpeciales: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Instructions spéciales pour la manutention'
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Notes particulières (marchandise fragile, urgente, etc.)'
  },
  valeurDeclaree: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Valeur déclarée en USD'
  },
  assurance: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Assurance souscrite ou non'
  },
  numeroSuivi: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
    comment: 'Numéro de suivi du colis'
  },
  chauffeurId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'transport_personnel',
      key: 'id'
    },
    comment: 'ID du chauffeur assigné'
  },
  vehiculeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'vehicules',
      key: 'id'
    },
    comment: 'ID du véhicule assigné'
  },
  coutTransport: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Coût du transport en USD'
  },
  reglementStatut: {
    type: DataTypes.ENUM('Non payé', 'Partiellement payé', 'Payé'),
    defaultValue: 'Non payé',
    comment: 'Statut du règlement'
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID de l\'utilisateur qui a créé l\'enregistrement'
  }
}, {
  tableName: 'marchandises',
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['reference']
    },
    {
      fields: ['expediteurId']
    },
    {
      fields: ['statut']
    },
    {
      fields: ['dateEnvoi']
    },
    {
      fields: ['numeroSuivi']
    },
    {
      fields: ['categoriePrincipale']
    },
    {
      fields: ['codeHS']
    },
    {
      fields: ['paysOrigine']
    },
    {
      fields: ['paysDestination']
    }
  ]
});

// Définir les associations
Marchandise.associate = (models) => {
  Marchandise.belongsTo(models.Client, {
    foreignKey: 'expediteurId',
    as: 'expediteur'
  });
  
  Marchandise.belongsTo(models.Personnel, {
    foreignKey: 'chauffeurId',
    as: 'chauffeur'
  });
  
  Marchandise.belongsTo(models.Vehicule, {
    foreignKey: 'vehiculeId',
    as: 'vehicule'
  });
  
  Marchandise.belongsTo(models.User, {
    foreignKey: 'createdById',
    as: 'createur'
  });
  
  Marchandise.belongsTo(models.Category, {
    foreignKey: 'categorieId',
    as: 'categorie'
  });
};

module.exports = Marchandise;
