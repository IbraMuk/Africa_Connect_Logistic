const Maintenance = require('../models/Maintenance');
const { Op } = require('sequelize');

// Obtenir toutes les maintenances
exports.getAllMaintenances = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut, priorite } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { equipement: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { technicien: { [Op.like]: `%${search}%` } }
      ];
    }

    if (statut) whereCondition.statut = statut;
    if (priorite) whereCondition.priorite = priorite;

    const { count, rows: maintenances } = await Maintenance.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateDebut', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        maintenances,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des maintenances:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des maintenances',
      error: error.message
    });
  }
};

// Obtenir une maintenance par son ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);
    
    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance non trouvée'
      });
    }

    res.json({
      success: true,
      data: maintenance
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la maintenance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la maintenance',
      error: error.message
    });
  }
};

// Créer une nouvelle maintenance
exports.createMaintenance = async (req, res) => {
  try {
    const {
      equipement,
      typeMaintenance,
      description,
      dateDebut,
      dateFin,
      cout,
      technicien,
      statut,
      priorite,
      observations,
      piecesRemplacees
    } = req.body;

    const maintenance = await Maintenance.create({
      equipement,
      typeMaintenance,
      description,
      dateDebut,
      dateFin,
      cout,
      technicien,
      statut,
      priorite,
      observations,
      piecesRemplacees
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance créée avec succès',
      data: maintenance
    });
  } catch (error) {
    console.error('Erreur lors de la création de la maintenance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la maintenance',
      error: error.message
    });
  }
};

// Mettre à jour une maintenance
exports.updateMaintenance = async (req, res) => {
  try {
    const {
      equipement,
      typeMaintenance,
      description,
      dateDebut,
      dateFin,
      cout,
      technicien,
      statut,
      priorite,
      observations,
      piecesRemplacees
    } = req.body;

    const maintenance = await Maintenance.findByPk(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance non trouvée'
      });
    }

    await maintenance.update({
      equipement,
      typeMaintenance,
      description,
      dateDebut,
      dateFin,
      cout,
      technicien,
      statut,
      priorite,
      observations,
      piecesRemplacees
    });

    res.json({
      success: true,
      message: 'Maintenance mise à jour avec succès',
      data: maintenance
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la maintenance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la maintenance',
      error: error.message
    });
  }
};

// Supprimer une maintenance
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance non trouvée'
      });
    }

    await maintenance.destroy();

    res.json({
      success: true,
      message: 'Maintenance supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la maintenance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la maintenance',
      error: error.message
    });
  }
};

// Obtenir les statistiques des maintenances
exports.getMaintenanceStats = async (req, res) => {
  try {
    const total = await Maintenance.count();
    const enAttente = await Maintenance.count({ where: { statut: 'en_attente' } });
    const enCours = await Maintenance.count({ where: { statut: 'en_cours' } });
    const terminees = await Maintenance.count({ where: { statut: 'terminee' } });
    const critiques = await Maintenance.count({ where: { priorite: 'critique' } });

    const totalCout = await Maintenance.sum('cout', { where: { statut: 'terminee' } }) || 0;

    res.json({
      success: true,
      data: {
        total,
        enAttente,
        enCours,
        terminees,
        critiques,
        totalCout
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
