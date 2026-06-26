const Tarif = require('../models/Tarif');
const Itineraire = require('../models/Itineraire');
const { Op } = require('sequelize');

// Obtenir tous les tarifs
exports.getAllTarifs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', classe, statut } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { description: { [Op.like]: `%${search}%` } },
        { devise: { [Op.like]: `%${search}%` } }
      ];
    }

    if (classe) whereCondition.classe = classe;
    if (statut) whereCondition.statut = statut;

    const { count, rows: tarifs } = await Tarif.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateCreation', 'DESC']],
      include: [{
        model: Itineraire,
        attributes: ['id', 'nom', 'pointDepart', 'pointArrivee']
      }]
    });

    res.json({
      success: true,
      data: {
        tarifs,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tarifs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des tarifs',
      error: error.message
    });
  }
};

// Obtenir un tarif par son ID
exports.getTarifById = async (req, res) => {
  try {
    const tarif = await Tarif.findByPk(req.params.id, {
      include: [{
        model: Itineraire,
        attributes: ['id', 'nom', 'pointDepart', 'pointArrivee']
      }]
    });
    
    if (!tarif) {
      return res.status(404).json({
        success: false,
        message: 'Tarif non trouvé'
      });
    }

    res.json({
      success: true,
      data: tarif
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du tarif:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du tarif',
      error: error.message
    });
  }
};

// Créer un nouveau tarif
exports.createTarif = async (req, res) => {
  try {
    const {
      itineraireId,
      classe,
      prix,
      devise,
      description,
      servicesInclus,
      statut
    } = req.body;

    const tarif = await Tarif.create({
      itineraireId,
      classe,
      prix,
      devise,
      description,
      servicesInclus,
      statut
    });

    res.status(201).json({
      success: true,
      message: 'Tarif créé avec succès',
      data: tarif
    });
  } catch (error) {
    console.error('Erreur lors de la création du tarif:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du tarif',
      error: error.message
    });
  }
};

// Mettre à jour un tarif
exports.updateTarif = async (req, res) => {
  try {
    const {
      itineraireId,
      classe,
      prix,
      devise,
      description,
      servicesInclus,
      statut
    } = req.body;

    const tarif = await Tarif.findByPk(req.params.id);

    if (!tarif) {
      return res.status(404).json({
        success: false,
        message: 'Tarif non trouvé'
      });
    }

    await tarif.update({
      itineraireId,
      classe,
      prix,
      devise,
      description,
      servicesInclus,
      statut
    });

    res.json({
      success: true,
      message: 'Tarif mis à jour avec succès',
      data: tarif
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tarif:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du tarif',
      error: error.message
    });
  }
};

// Supprimer un tarif
exports.deleteTarif = async (req, res) => {
  try {
    const tarif = await Tarif.findByPk(req.params.id);

    if (!tarif) {
      return res.status(404).json({
        success: false,
        message: 'Tarif non trouvé'
      });
    }

    await tarif.destroy();

    res.json({
      success: true,
      message: 'Tarif supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du tarif:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du tarif',
      error: error.message
    });
  }
};

// Obtenir les statistiques des tarifs
exports.getTarifStats = async (req, res) => {
  try {
    const total = await Tarif.count();
    const actifs = await Tarif.count({ where: { statut: 'actif' } });
    const inactifs = await Tarif.count({ where: { statut: 'inactif' } });

    const parClasse = await Tarif.findAll({
      attributes: [
        'classe',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('AVG', require('sequelize').col('prix')), 'prixMoyen']
      ],
      group: ['classe']
    });

    res.json({
      success: true,
      data: {
        total,
        actifs,
        inactifs,
        parClasse
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
