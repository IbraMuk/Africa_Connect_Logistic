const { Billet, User } = require('../models');
const Joi = require('joi');
const moment = require('moment');

// Générer une référence de réservation unique
const generateReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = '';
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ACL-${ref}`;
};

// Schéma de validation
const billetSchema = Joi.object({
  typeVoyage: Joi.string().valid('aller_simple', 'aller_retour').required(),
  typeTransport: Joi.string().valid('bus', 'train', 'avion', 'bateau').required(),
  numeroVol: Joi.string().optional(),
  compagnie: Joi.string().required(),
  depart: Joi.string().required(),
  arrivee: Joi.string().required(),
  dateHeureDepart: Joi.date().iso().min('now').required(),
  dateHeureArrivee: Joi.date().iso().min(Joi.ref('dateHeureDepart')).required(),
  dateHeureDepartRetour: Joi.date().iso().min(Joi.ref('dateHeureArrivee')).optional(),
  dateHeureArriveeRetour: Joi.date().iso().min(Joi.ref('dateHeureDepartRetour')).optional(),
  classe: Joi.string().valid('economique', 'business', 'premiere').default('economique'),
  numeroSiege: Joi.string().optional(),
  passagers: Joi.array().min(1).required(),
  prix: Joi.number().min(0).required(),
  taxes: Joi.number().min(0).default(0),
  fraisService: Joi.number().min(0).default(0),
  bagages: Joi.array().optional(),
  servicesSupplementaires: Joi.array().optional(),
  notes: Joi.string().optional()
});

// Créer une réservation de billet
const createBillet = async (req, res) => {
  try {
    const { error, value } = billetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    // Calculer le prix total
    const prixTotal = (value.prix + value.taxes + value.fraisService) * value.passagers.length;

    const billet = await Billet.create({
      ...value,
      prixTotal,
      referenceReservation: generateReference(),
      clientId: req.user.id
    });

    const billetAvecAssociations = await Billet.findByPk(billet.id, {
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ]
    });

    res.status(201).json({
      message: 'Réservation créée avec succès',
      billet: billetAvecAssociations
    });
  } catch (error) {
    console.error('Erreur createBillet:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de créer la réservation'
    });
  }
};

// Obtenir tous les billets (pour l'utilisateur connecté)
const getBillets = async (req, res) => {
  try {
    const { statut, date } = req.query;
    const whereClause = { clientId: req.user.id };
    
    if (statut) whereClause.statut = statut;
    
    if (date) {
      const dateDebut = moment(date).startOf('day').toDate();
      const dateFin = moment(date).endOf('day').toDate();
      whereClause.dateHeureDepart = {
        [require('sequelize').Op.between]: [dateDebut, dateFin]
      };
    }

    const billets = await Billet.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ],
      order: [['dateHeureDepart', 'DESC']]
    });

    res.json({ billets });
  } catch (error) {
    console.error('Erreur getBillets:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer les billets'
    });
  }
};

// Obtenir un billet par sa référence
const getBilletByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const billet = await Billet.findOne({
      where: { referenceReservation: reference },
      include: [
        { model: User, as: 'client', attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }
      ]
    });

    if (!billet) {
      return res.status(404).json({
        error: 'Billet non trouvé',
        message: 'Cette référence n\'existe pas'
      });
    }

    res.json({ billet });
  } catch (error) {
    console.error('Erreur getBilletByReference:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer le billet'
    });
  }
};

// Annuler une réservation
const cancelBillet = async (req, res) => {
  try {
    const { id } = req.params;
    
    const billet = await Billet.findByPk(id);
    if (!billet) {
      return res.status(404).json({
        error: 'Billet non trouvé',
        message: 'Ce billet n\'existe pas'
      });
    }

    if (billet.clientId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Vous n\'êtes pas autorisé à annuler ce billet'
      });
    }

    if (billet.statut === 'annulé' || billet.statut === 'remboursé') {
      return res.status(400).json({
        error: 'Action impossible',
        message: 'Ce billet est déjà annulé'
      });
    }

    await billet.update({ statut: 'annulé' });
    
    res.json({
      message: 'Billet annulé avec succès',
      billet
    });
  } catch (error) {
    console.error('Erreur cancelBillet:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible d\'annuler le billet'
    });
  }
};

module.exports = {
  createBillet,
  getBillets,
  getBilletByReference,
  cancelBillet
};
