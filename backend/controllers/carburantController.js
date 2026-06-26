const Carburant = require('../models/Carburant');
const { Op } = require('sequelize');

// Obtenir tous les carburants
exports.getAllCarburants = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', typeCarburant } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { vehicule: { [Op.like]: `%${search}%` } },
        { station: { [Op.like]: `%${search}%` } },
        { chauffeur: { [Op.like]: `%${search}%` } }
      ];
    }

    if (typeCarburant) whereCondition.typeCarburant = typeCarburant;

    const { count, rows: carburants } = await Carburant.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        carburants,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des carburants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des carburants',
      error: error.message
    });
  }
};

// Obtenir un carburant par son ID
exports.getCarburantById = async (req, res) => {
  try {
    const carburant = await Carburant.findByPk(req.params.id);
    
    if (!carburant) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    res.json({
      success: true,
      data: carburant
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du carburant',
      error: error.message
    });
  }
};

// Créer un nouveau carburant
exports.createCarburant = async (req, res) => {
  try {
    const {
      vehicule,
      typeCarburant,
      quantite,
      prixUnitaire,
      montantTotal,
      date,
      station,
      kilometrage,
      chauffeur,
      typePaiement,
      notes
    } = req.body;

    const carburant = await Carburant.create({
      vehicule,
      typeCarburant,
      quantite,
      prixUnitaire,
      montantTotal,
      date,
      station,
      kilometrage,
      chauffeur,
      typePaiement,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Carburant créé avec succès',
      data: carburant
    });
  } catch (error) {
    console.error('Erreur lors de la création du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du carburant',
      error: error.message
    });
  }
};

// Mettre à jour un carburant
exports.updateCarburant = async (req, res) => {
  try {
    const {
      vehicule,
      typeCarburant,
      quantite,
      prixUnitaire,
      montantTotal,
      date,
      station,
      kilometrage,
      chauffeur,
      typePaiement,
      notes
    } = req.body;

    const carburant = await Carburant.findByPk(req.params.id);

    if (!carburant) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    await carburant.update({
      vehicule,
      typeCarburant,
      quantite,
      prixUnitaire,
      montantTotal,
      date,
      station,
      kilometrage,
      chauffeur,
      typePaiement,
      notes
    });

    res.json({
      success: true,
      message: 'Carburant mis à jour avec succès',
      data: carburant
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du carburant',
      error: error.message
    });
  }
};

// Supprimer un carburant
exports.deleteCarburant = async (req, res) => {
  try {
    const carburant = await Carburant.findByPk(req.params.id);

    if (!carburant) {
      return res.status(404).json({
        success: false,
        message: 'Carburant non trouvé'
      });
    }

    await carburant.destroy();

    res.json({
      success: true,
      message: 'Carburant supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du carburant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du carburant',
      error: error.message
    });
  }
};

// Obtenir les statistiques des carburants
exports.getCarburantStats = async (req, res) => {
  try {
    const total = await Carburant.count();
    const totalMontant = await Carburant.sum('montantTotal') || 0;
    const totalQuantite = await Carburant.sum('quantite') || 0;

    const parType = await Carburant.findAll({
      attributes: [
        'typeCarburant',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('quantite')), 'totalQuantite'],
        [require('sequelize').fn('SUM', require('sequelize').col('montantTotal')), 'totalMontant']
      ],
      group: ['typeCarburant']
    });

    res.json({
      success: true,
      data: {
        total,
        totalMontant,
        totalQuantite,
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
