const { ImportExport, User } = require('../models');
const Joi = require('joi');
const moment = require('moment');

// Générer un numéro de suivi unique
const generateNumeroSuivi = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suivi = '';
  for (let i = 0; i < 10; i++) {
    suivi += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ACL-IMP-${suivi}`;
};

// Schéma de validation
const importExportSchema = Joi.object({
  typeOperation: Joi.string().valid('import', 'export', 'transit').required(),
  numeroDeclaration: Joi.string().optional(),
  paysOrigine: Joi.string().required(),
  paysDestination: Joi.string().required(),
  portDepart: Joi.string().required(),
  portArrivee: Joi.string().required(),
  typeMarchandise: Joi.string().valid('general', 'dangerux', 'perissable', 'electronique', 'vehicule', 'textile', 'agricole').required(),
  descriptionDetaillee: Joi.string().required(),
  poidsTotal: Joi.number().min(0.01).required(),
  volumeTotal: Joi.number().min(0).optional(),
  nombreConteneurs: Joi.number().integer().min(0).default(0),
  typeConteneurs: Joi.array().optional(),
  incoterms: Joi.string().valid('EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DPP', 'DDP').required(),
  modeTransport: Joi.string().valid('maritime', 'aerien', 'routier', 'ferroviaire', 'multimodal').required(),
  dateExpedition: Joi.date().iso().min('now').required(),
  dateArriveePrevue: Joi.date().iso().min(Joi.ref('dateExpedition')).required(),
  valeurMarchandise: Joi.number().min(0).required(),
  devise: Joi.string().length(3).default('USD'),
  coutTransport: Joi.number().min(0).required(),
  coutDouane: Joi.number().min(0).default(0),
  coutAssurance: Joi.number().min(0).default(0),
  documents: Joi.array().optional(),
  certificats: Joi.array().optional(),
  notes: Joi.string().optional()
});

// Créer une opération d'import/export
const createOperation = async (req, res) => {
  try {
    const { error, value } = importExportSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    // Calculer le coût total
    const coutTotal = value.coutTransport + value.coutDouane + value.coutAssurance;

    const operation = await ImportExport.create({
      ...value,
      coutTotal,
      numeroSuivi: generateNumeroSuivi(),
      clientId: req.user.id
    });

    const operationAvecAssociations = await ImportExport.findByPk(operation.id, {
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ]
    });

    res.status(201).json({
      message: 'Opération créée avec succès',
      operation: operationAvecAssociations
    });
  } catch (error) {
    console.error('Erreur createOperation:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de créer l\'opération'
    });
  }
};

// Obtenir toutes les opérations (pour l'utilisateur connecté)
const getOperations = async (req, res) => {
  try {
    const { typeOperation, statut, date } = req.query;
    const whereClause = { clientId: req.user.id };
    
    if (typeOperation) whereClause.typeOperation = typeOperation;
    if (statut) whereClause.statut = statut;
    
    if (date) {
      const dateDebut = moment(date).startOf('day').toDate();
      const dateFin = moment(date).endOf('day').toDate();
      whereClause.dateExpedition = {
        [require('sequelize').Op.between]: [dateDebut, dateFin]
      };
    }

    const operations = await ImportExport.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ],
      order: [['dateExpedition', 'DESC']]
    });

    res.json({ operations });
  } catch (error) {
    console.error('Erreur getOperations:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les opérations'
    });
  }
};

// Suivre une opération par numéro de suivi
const trackOperation = async (req, res) => {
  try {
    const { numeroSuivi } = req.params;
    
    const operation = await ImportExport.findOne({
      where: { numeroSuivi },
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ]
    });

    if (!operation) {
      return res.status(404).json({
        error: 'Opération non trouvée',
        message: 'Ce numéro de suivi n\'existe pas'
      });
    }

    res.json({ operation });
  } catch (error) {
    console.error('Erreur trackOperation:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de suivre l\'opération'
    });
  }
};

// Mettre à jour le statut d'une opération
const updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, dateArriveeReelle } = req.body;
    
    const operation = await ImportExport.findByPk(id);
    if (!operation) {
      return res.status(404).json({
        error: 'Opération non trouvée',
        message: 'Cette opération n\'existe pas'
      });
    }

    if (operation.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à modifier cette opération'
      });
    }

    const updateData = { statut };
    if (dateArriveeReelle) {
      updateData.dateArriveeReelle = dateArriveeReelle;
    }

    await operation.update(updateData);
    
    res.json({
      message: 'Statut mis à jour avec succès',
      operation
    });
  } catch (error) {
    console.error('Erreur updateStatut:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour le statut'
    });
  }
};

module.exports = {
  createOperation,
  getOperations,
  trackOperation,
  updateStatut
};
