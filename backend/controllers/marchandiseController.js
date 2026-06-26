const { TransportMarchandise, User } = require('../models');
const Joi = require('joi');
const moment = require('moment');

// Schéma de validation
const marchandiseSchema = Joi.object({
  typeMarchandise: Joi.string().valid('standard', 'fragile', 'dangereux', 'perissable', 'lourde', 'volumineux').required(),
  description: Joi.string().required(),
  poids: Joi.number().min(0.01).required(),
  volume: Joi.number().min(0).optional(),
  pointEnlevement: Joi.string().min(3).max(200).required(),
  pointLivraison: Joi.string().min(3).max(200).required(),
  dateEnlevement: Joi.date().iso().min('now').required(),
  dateLivraisonPrevue: Joi.date().iso().min(Joi.ref('dateEnlevement')).required(),
  vehicule: Joi.string().optional(),
  immatriculation: Joi.string().optional(),
  prix: Joi.number().min(0).required(),
  assurance: Joi.boolean().default(false),
  valeurAssurance: Joi.number().min(0).optional(),
  instructionsSpeciales: Joi.string().optional(),
  photos: Joi.array().optional()
});

// Créer une demande de transport marchandise
const createTransport = async (req, res) => {
  try {
    const { error, value } = marchandiseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    const transport = await TransportMarchandise.create({
      ...value,
      clientId: req.user.id
    });

    const transportAvecAssociations = await TransportMarchandise.findByPk(transport.id, {
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ]
    });

    res.status(201).json({
      message: 'Demande de transport marchandise créée avec succès',
      transport: transportAvecAssociations
    });
  } catch (error) {
    console.error('Erreur createTransport:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de créer la demande de transport'
    });
  }
};

// Obtenir tous les transports marchandise (pour l'utilisateur connecté)
const getTransports = async (req, res) => {
  try {
    const { statut, date } = req.query;
    const whereClause = { clientId: req.user.id };
    
    if (statut) whereClause.statut = statut;
    
    if (date) {
      const dateDebut = moment(date).startOf('day').toDate();
      const dateFin = moment(date).endOf('day').toDate();
      whereClause.dateEnlevement = {
        [require('sequelize').Op.between]: [dateDebut, dateFin]
      };
    }

    const transports = await TransportMarchandise.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: User, as: 'chauffeur', attributes: ['id', 'nom', 'prenom', 'telephone'] }
      ],
      order: [['dateEnlevement', 'DESC']]
    });

    res.json({ transports });
  } catch (error) {
    console.error('Erreur getTransports:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les transports'
    });
  }
};

// Obtenir un transport par son ID
const getTransportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transport = await TransportMarchandise.findByPk(id, {
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: User, as: 'chauffeur', attributes: ['id', 'nom', 'prenom', 'telephone'] }
      ]
    });

    if (!transport) {
      return res.status(404).json({
        error: 'Transport non trouvé',
        message: 'Ce transport n\'existe pas'
      });
    }

    if (transport.clientId !== req.user.id && transport.chauffeurId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à voir ce transport'
      });
    }

    res.json({ transport });
  } catch (error) {
    console.error('Erreur getTransportById:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer le transport'
    });
  }
};

// Mettre à jour le statut d'un transport
const updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, dateLivraisonReelle } = req.body;
    
    const transport = await TransportMarchandise.findByPk(id);
    if (!transport) {
      return res.status(404).json({
        error: 'Transport non trouvé',
        message: 'Ce transport n\'existe pas'
      });
    }

    // Seul le chauffeur ou admin peut modifier le statut
    if (transport.chauffeurId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à modifier ce transport'
      });
    }

    const updateData = { statut };
    if (dateLivraisonReelle && statut === 'livré') {
      updateData.dateLivraisonReelle = dateLivraisonReelle;
    }

    await transport.update(updateData);
    
    res.json({
      message: 'Statut mis à jour avec succès',
      transport
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
  createTransport,
  getTransports,
  getTransportById,
  updateStatut
};
