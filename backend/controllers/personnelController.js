const { TransportPersonnel, User } = require('../models');
const Joi = require('joi');
const moment = require('moment');

// Schéma de validation
const personnelSchema = Joi.object({
  typeTransport: Joi.string().valid('navette', 'vip', 'collectif', 'individuel').required(),
  pointDepart: Joi.string().min(3).max(200).required(),
  pointArrivee: Joi.string().min(3).max(200).required(),
  dateHeureDepart: Joi.date().iso().min('now').required(),
  nombrePersonnes: Joi.number().integer().min(1).max(50).required(),
  informationsPassagers: Joi.array().optional(),
  vehicule: Joi.string().optional(),
  immatriculation: Joi.string().optional(),
  prix: Joi.number().min(0).required(),
  notes: Joi.string().optional()
});

// Créer une demande de transport personnel
const createTransport = async (req, res) => {
  try {
    const { error, value } = personnelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    const transport = await TransportPersonnel.create({
      ...value,
      clientId: req.user.id
    });

    // Récupérer le transport avec les associations
    const transportAvecAssociations = await TransportPersonnel.findByPk(transport.id, {
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ]
    });

    res.status(201).json({
      message: 'Demande de transport créée avec succès',
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

// Obtenir tous les transports (pour l'utilisateur connecté)
const getTransports = async (req, res) => {
  try {
    const { statut, date } = req.query;
    const whereClause = { clientId: req.user.id };
    
    if (statut) {
      whereClause.statut = statut;
    }
    
    if (date) {
      const dateDebut = moment(date).startOf('day').toDate();
      const dateFin = moment(date).endOf('day').toDate();
      whereClause.dateHeureDepart = {
        [require('sequelize').Op.between]: [dateDebut, dateFin]
      };
    }

    const transports = await TransportPersonnel.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: User, as: 'chauffeur', attributes: ['id', 'nom', 'prenom', 'telephone'] }
      ],
      order: [['dateHeureDepart', 'DESC']]
    });

    res.json({
      transports
    });
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
    
    const transport = await TransportPersonnel.findByPk(id, {
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

    // Vérifier que l'utilisateur est le client ou le chauffeur
    if (transport.clientId !== req.user.id && transport.chauffeurId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à voir ce transport'
      });
    }

    res.json({
      transport
    });
  } catch (error) {
    console.error('Erreur getTransportById:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer le transport'
    });
  }
};

// Mettre à jour un transport
const updateTransport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transport = await TransportPersonnel.findByPk(id);
    if (!transport) {
      return res.status(404).json({
        error: 'Transport non trouvé',
        message: 'Ce transport n\'existe pas'
      });
    }

    // Vérifier les autorisations
    if (transport.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à modifier ce transport'
      });
    }

    const { error, value } = personnelSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    await transport.update(value);
    
    const transportMisAJour = await TransportPersonnel.findByPk(id, {
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: User, as: 'chauffeur', attributes: ['id', 'nom', 'prenom', 'telephone'] }
      ]
    });

    res.json({
      message: 'Transport mis à jour avec succès',
      transport: transportMisAJour
    });
  } catch (error) {
    console.error('Erreur updateTransport:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour le transport'
    });
  }
};

// Annuler un transport
const cancelTransport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transport = await TransportPersonnel.findByPk(id);
    if (!transport) {
      return res.status(404).json({
        error: 'Transport non trouvé',
        message: 'Ce transport n\'existe pas'
      });
    }

    // Vérifier les autorisations
    if (transport.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à annuler ce transport'
      });
    }

    // Vérifier que le transport peut être annulé
    if (transport.statut === 'terminé' || transport.statut === 'annulé') {
      return res.status(400).json({
        error: 'Action impossible',
        message: 'Ce transport ne peut plus être annulé'
      });
    }

    await transport.update({ statut: 'annulé' });
    
    res.json({
      message: 'Transport annulé avec succès',
      transport
    });
  } catch (error) {
    console.error('Erreur cancelTransport:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible d\'annuler le transport'
    });
  }
};

// Obtenir tous les transports (pour admin/chauffeur)
const getAllTransports = async (req, res) => {
  try {
    const { statut, date } = req.query;
    const whereClause = {};
    
    if (statut) {
      whereClause.statut = statut;
    }
    
    if (date) {
      const dateDebut = moment(date).startOf('day').toDate();
      const dateFin = moment(date).endOf('day').toDate();
      whereClause.dateHeureDepart = {
        [require('sequelize').Op.between]: [dateDebut, dateFin]
      };
    }

    const transports = await TransportPersonnel.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] },
        { model: User, as: 'chauffeur', attributes: ['id', 'nom', 'prenom', 'telephone'] }
      ],
      order: [['dateHeureDepart', 'DESC']]
    });

    res.json({
      transports
    });
  } catch (error) {
    console.error('Erreur getAllTransports:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les transports'
    });
  }
};

module.exports = {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  cancelTransport,
  getAllTransports
};
