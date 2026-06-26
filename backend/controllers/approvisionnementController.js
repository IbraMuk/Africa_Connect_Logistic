const Approvisionnement = require('../models/Approvisionnement');
const { Op } = require('sequelize');

// Obtenir tous les approvisionnements
exports.getAllApprovisionnements = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut, fournisseur } = req.query;
    const offset = (page - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [
        { reference: { [Op.like]: `%${search}%` } },
        { article: { [Op.like]: `%${search}%` } },
        { fournisseur: { [Op.like]: `%${search}%` } }
      ];
    }

    if (statut) whereCondition.statut = statut;
    if (fournisseur) whereCondition.fournisseur = fournisseur;

    const { count, rows: approvisionnements } = await Approvisionnement.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateCommande', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        approvisionnements,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des approvisionnements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des approvisionnements',
      error: error.message
    });
  }
};

// Obtenir un approvisionnement par son ID
exports.getApprovisionnementById = async (req, res) => {
  try {
    const approvisionnement = await Approvisionnement.findByPk(req.params.id);
    
    if (!approvisionnement) {
      return res.status(404).json({
        success: false,
        message: 'Approvisionnement non trouvé'
      });
    }

    res.json({
      success: true,
      data: approvisionnement
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'approvisionnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'approvisionnement',
      error: error.message
    });
  }
};

// Créer un nouvel approvisionnement
exports.createApprovisionnement = async (req, res) => {
  try {
    const {
      reference,
      fournisseur,
      article,
      categorie,
      quantite,
      unite,
      prixUnitaire,
      montantTotal,
      dateCommande,
      dateLivraisonPrevue,
      dateLivraisonReelle,
      statut,
      modePaiement,
      statutPaiement,
      notes
    } = req.body;

    const approvisionnement = await Approvisionnement.create({
      reference,
      fournisseur,
      article,
      categorie,
      quantite,
      unite,
      prixUnitaire,
      montantTotal,
      dateCommande,
      dateLivraisonPrevue,
      dateLivraisonReelle,
      statut,
      modePaiement,
      statutPaiement,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Approvisionnement créé avec succès',
      data: approvisionnement
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'approvisionnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'approvisionnement',
      error: error.message
    });
  }
};

// Mettre à jour un approvisionnement
exports.updateApprovisionnement = async (req, res) => {
  try {
    const {
      reference,
      fournisseur,
      article,
      categorie,
      quantite,
      unite,
      prixUnitaire,
      montantTotal,
      dateCommande,
      dateLivraisonPrevue,
      dateLivraisonReelle,
      statut,
      modePaiement,
      statutPaiement,
      notes
    } = req.body;

    const approvisionnement = await Approvisionnement.findByPk(req.params.id);

    if (!approvisionnement) {
      return res.status(404).json({
        success: false,
        message: 'Approvisionnement non trouvé'
      });
    }

    await approvisionnement.update({
      reference,
      fournisseur,
      article,
      categorie,
      quantite,
      unite,
      prixUnitaire,
      montantTotal,
      dateCommande,
      dateLivraisonPrevue,
      dateLivraisonReelle,
      statut,
      modePaiement,
      statutPaiement,
      notes
    });

    res.json({
      success: true,
      message: 'Approvisionnement mis à jour avec succès',
      data: approvisionnement
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'approvisionnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'approvisionnement',
      error: error.message
    });
  }
};

// Supprimer un approvisionnement
exports.deleteApprovisionnement = async (req, res) => {
  try {
    const approvisionnement = await Approvisionnement.findByPk(req.params.id);

    if (!approvisionnement) {
      return res.status(404).json({
        success: false,
        message: 'Approvisionnement non trouvé'
      });
    }

    await approvisionnement.destroy();

    res.json({
      success: true,
      message: 'Approvisionnement supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'approvisionnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'approvisionnement',
      error: error.message
    });
  }
};

// Obtenir les statistiques des approvisionnements
exports.getApprovisionnementStats = async (req, res) => {
  try {
    const total = await Approvisionnement.count();
    const enAttente = await Approvisionnement.count({ where: { statut: 'en_attente' } });
    const commandees = await Approvisionnement.count({ where: { statut: 'commandee' } });
    const enTransit = await Approvisionnement.count({ where: { statut: 'en_transit' } });
    const livrees = await Approvisionnement.count({ where: { statut: 'livree' } });

    const totalMontant = await Approvisionnement.sum('montantTotal') || 0;
    const montantPaye = await Approvisionnement.sum('montantTotal', { where: { statutPaiement: 'payee' } }) || 0;

    res.json({
      success: true,
      data: {
        total,
        enAttente,
        commandees,
        enTransit,
        livrees,
        totalMontant,
        montantPaye
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
