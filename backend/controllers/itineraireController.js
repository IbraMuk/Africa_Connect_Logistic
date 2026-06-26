const Itineraire = require('../models/Itineraire');
const { Op } = require('sequelize');

// Obtenir tous les itinéraires
exports.getAllItineraires = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut, typeTransport } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { nom: { [Op.like]: `%${search}%` } },
        { pointDepart: { [Op.like]: `%${search}%` } },
        { pointArrivee: { [Op.like]: `%${search}%` } }
      ];
    }

    if (statut) whereCondition.statut = statut;
    if (typeTransport) whereCondition.typeTransport = typeTransport;

    const { count, rows: itineraires } = await Itineraire.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateCreation', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        itineraires,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des itinéraires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des itinéraires',
      error: error.message
    });
  }
};

// Obtenir un itinéraire par son ID
exports.getItineraireById = async (req, res) => {
  try {
    const itineraire = await Itineraire.findByPk(req.params.id);
    
    if (!itineraire) {
      return res.status(404).json({
        success: false,
        message: 'Itinéraire non trouvé'
      });
    }

    res.json({
      success: true,
      data: itineraire
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'itinéraire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'itinéraire',
      error: error.message
    });
  }
};

// Créer un nouvel itinéraire
exports.createItineraire = async (req, res) => {
  try {
    const {
      nom,
      pointDepart,
      pointArrivee,
      distance,
      dureeEstimee,
      description,
      statut,
      typeTransport,
      zonesTraversees,
      prixBase
    } = req.body;

    const itineraire = await Itineraire.create({
      nom,
      pointDepart,
      pointArrivee,
      distance,
      dureeEstimee,
      description,
      statut,
      typeTransport,
      zonesTraversees,
      prixBase
    });

    res.status(201).json({
      success: true,
      message: 'Itinéraire créé avec succès',
      data: itineraire
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'itinéraire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'itinéraire',
      error: error.message
    });
  }
};

// Mettre à jour un itinéraire
exports.updateItineraire = async (req, res) => {
  try {
    const {
      nom,
      pointDepart,
      pointArrivee,
      distance,
      dureeEstimee,
      description,
      statut,
      typeTransport,
      zonesTraversees,
      prixBase
    } = req.body;

    const itineraire = await Itineraire.findByPk(req.params.id);

    if (!itineraire) {
      return res.status(404).json({
        success: false,
        message: 'Itinéraire non trouvé'
      });
    }

    await itineraire.update({
      nom,
      pointDepart,
      pointArrivee,
      distance,
      dureeEstimee,
      description,
      statut,
      typeTransport,
      zonesTraversees,
      prixBase
    });

    res.json({
      success: true,
      message: 'Itinéraire mis à jour avec succès',
      data: itineraire
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'itinéraire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'itinéraire',
      error: error.message
    });
  }
};

// Supprimer un itinéraire
exports.deleteItineraire = async (req, res) => {
  try {
    const itineraire = await Itineraire.findByPk(req.params.id);

    if (!itineraire) {
      return res.status(404).json({
        success: false,
        message: 'Itinéraire non trouvé'
      });
    }

    await itineraire.destroy();

    res.json({
      success: true,
      message: 'Itinéraire supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'itinéraire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'itinéraire',
      error: error.message
    });
  }
};

// Obtenir les statistiques des itinéraires
exports.getItineraireStats = async (req, res) => {
  try {
    const total = await Itineraire.count();
    const actifs = await Itineraire.count({ where: { statut: 'actif' } });
    const inactifs = await Itineraire.count({ where: { statut: 'inactif' } });
    const suspendus = await Itineraire.count({ where: { statut: 'suspendu' } });

    const parType = await Itineraire.findAll({
      attributes: [
        'typeTransport',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['typeTransport']
    });

    res.json({
      success: true,
      data: {
        total,
        actifs,
        inactifs,
        suspendus,
        parType
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};
