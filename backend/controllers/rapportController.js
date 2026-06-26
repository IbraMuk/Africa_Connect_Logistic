const Facture = require('../models/Facture');
const Maintenance = require('../models/Maintenance');
const Approvisionnement = require('../models/Approvisionnement');
const Carburant = require('../models/Carburant');
const TransportMarchandise = require('../models/TransportMarchandise');
const Client = require('../models/Client');
const { Op, literal } = require('sequelize');

// Rapport financier global
exports.getRapportFinancier = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const whereCondition = {};
    if (dateDebut && dateFin) {
      whereCondition.dateFacture = {
        [Op.between]: [dateDebut, dateFin]
      };
    }

    // Revenus (factures payées)
    const revenus = await Facture.sum('montant', {
      where: {
        statut: 'Payée',
        ...whereCondition
      }
    }) || 0;

    // Dépenses maintenance
    const depensesMaintenance = await Maintenance.sum('cout', {
      where: {
        statut: 'terminee',
        ...(dateDebut && dateFin ? { dateDebut: { [Op.between]: [dateDebut, dateFin] } } : {})
      }
    }) || 0;

    // Dépenses carburant
    const depensesCarburant = await Carburant.sum('montantTotal', {
      where: {
        ...(dateDebut && dateFin ? { date: { [Op.between]: [dateDebut, dateFin] } } : {})
      }
    }) || 0;

    // Dépenses approvisionnement
    const depensesApprovisionnement = await Approvisionnement.sum('montantTotal', {
      where: {
        statut: 'livree',
        ...(dateDebut && dateFin ? { dateCommande: { [Op.between]: [dateDebut, dateFin] } } : {})
      }
    }) || 0;

    const totalDepenses = depensesMaintenance + depensesCarburant + depensesApprovisionnement;
    const benefice = revenus - totalDepenses;

    res.json({
      success: true,
      data: {
        revenus,
        depenses: {
          maintenance: depensesMaintenance,
          carburant: depensesCarburant,
          approvisionnement: depensesApprovisionnement,
          total: totalDepenses
        },
        benefice
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport financier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport financier',
      error: error.message
    });
  }
};

// Rapport des factures
exports.getRapportFactures = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const whereCondition = {};
    if (dateDebut && dateFin) {
      whereCondition.dateFacture = {
        [Op.between]: [dateDebut, dateFin]
      };
    }

    const factures = await Facture.findAll({
      where: whereCondition,
      order: [['dateFacture', 'DESC']]
    });

    const totalMontant = await Facture.sum('montant', { where: whereCondition }) || 0;
    const payees = await Facture.count({
      where: { statut: 'Payée', ...whereCondition }
    });
    const enAttente = await Facture.count({
      where: { statut: 'En attente', ...whereCondition }
    });

    res.json({
      success: true,
      data: {
        factures,
        totalMontant,
        payees,
        enAttente
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport factures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport factures',
      error: error.message
    });
  }
};

// Rapport des dépenses
exports.getRapportDepenses = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const dateCondition = {};
    if (dateDebut && dateFin) {
      dateCondition[Op.between] = [dateDebut, dateFin];
    }

    // Maintenance
    const maintenanceTotal = await Maintenance.sum('cout', {
      where: {
        statut: 'terminee',
        dateDebut: dateCondition
      }
    }) || 0;

    // Carburant
    const carburantTotal = await Carburant.sum('montantTotal', {
      where: { date: dateCondition }
    }) || 0;

    // Approvisionnement
    const approvisionnementTotal = await Approvisionnement.sum('montantTotal', {
      where: {
        statut: 'livree',
        dateCommande: dateCondition
      }
    }) || 0;

    const total = maintenanceTotal + carburantTotal + approvisionnementTotal;

    res.json({
      success: true,
      data: {
        maintenance: maintenanceTotal,
        carburant: carburantTotal,
        approvisionnement: approvisionnementTotal,
        total
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport dépenses:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport dépenses',
      error: error.message
    });
  }
};

// Rapport d'activité
exports.getRapportActivite = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const dateCondition = {};
    if (dateDebut && dateFin) {
      dateCondition[Op.between] = [dateDebut, dateFin];
    }

    // Factures
    const facturesTotal = await Facture.count({
      where: dateCondition
    }) || 0;

    const facturesPayees = await Facture.count({
      where: { statut: 'Payée', ...dateCondition }
    }) || 0;

    // Maintenances
    const maintenancesTotal = await Maintenance.count({
      where: dateCondition
    }) || 0;

    const maintenancesTerminees = await Maintenance.count({
      where: { statut: 'terminee', ...dateCondition }
    }) || 0;

    // Carburants
    const carburantsTotal = await Carburant.count({
      where: dateCondition
    }) || 0;

    const carburantsQuantite = await Carburant.sum('quantite', {
      where: dateCondition
    }) || 0;

    // Approvisionnements
    const approvisionnementsTotal = await Approvisionnement.count({
      where: dateCondition
    }) || 0;

    const approvisionnementsLivre = await Approvisionnement.count({
      where: { statut: 'livree', ...dateCondition }
    }) || 0;

    // Transport de marchandises
    const transportsTotal = await TransportMarchandise.count({
      where: dateCondition
    }) || 0;

    const transportsLivres = await TransportMarchandise.count({
      where: { statut: 'livree', ...dateCondition }
    }) || 0;

    res.json({
      success: true,
      data: {
        factures: {
          total: facturesTotal,
          payees: facturesPayees
        },
        maintenances: {
          total: maintenancesTotal,
          terminees: maintenancesTerminees
        },
        carburants: {
          total: carburantsTotal,
          quantite: carburantsQuantite
        },
        approvisionnements: {
          total: approvisionnementsTotal,
          livre: approvisionnementsLivre
        },
        transports: {
          total: transportsTotal,
          livres: transportsLivres
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport activité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport activité',
      error: error.message
    });
  }
};

// Rapport clients
exports.getRapportClients = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const dateCondition = {};
    if (dateDebut && dateFin) {
      dateCondition[Op.between] = [dateDebut, dateFin];
    }

    // Total clients
    const totalClients = await Client.count() || 0;

    // Clients actifs
    const clientsActifs = await Client.count({
      where: { statut: 'actif' }
    }) || 0;

    // Nouveaux clients dans la période
    const nouveauxClients = await Client.count({
      where: {
        dateInscription: dateCondition
      }
    }) || 0;

    // Top clients par nombre de factures
    const topClients = await Client.findAll({
      include: [{
        model: Facture,
        required: false
      }],
      attributes: [
        'id',
        'nom',
        'prenom',
        'email',
        [require('sequelize').fn('COUNT', require('sequelize').col('Factures.id')), 'nombreFactures'],
        [require('sequelize').fn('SUM', require('sequelize').col('Factures.montant')), 'totalFactures']
      ],
      group: ['Client.id'],
      order: [[require('sequelize').literal('nombreFactures'), 'DESC']],
      limit: 10
    });

    // Répartition par type
    const parType = await Client.findAll({
      attributes: [
        'type',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['type']
    });

    res.json({
      success: true,
      data: {
        total: totalClients,
        actifs: clientsActifs,
        nouveaux: nouveauxClients,
        topClients,
        parType
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport clients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport clients',
      error: error.message
    });
  }
};

// Rapport véhicules
exports.getRapportVehicules = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    
    const dateCondition = {};
    if (dateDebut && dateFin) {
      dateCondition[Op.between] = [dateDebut, dateFin];
    }

    // Statistiques de carburant par véhicule
    const carburantParVehicule = await Carburant.findAll({
      attributes: [
        'vehicule',
        'typeCarburant',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'nombreRavitaillements'],
        [require('sequelize').fn('SUM', require('sequelize').col('quantite')), 'totalQuantite'],
        [require('sequelize').fn('SUM', require('sequelize').col('montantTotal')), 'totalMontant'],
        [require('sequelize').fn('AVG', require('sequelize').col('quantite')), 'moyenneQuantite']
      ],
      where: dateCondition,
      group: ['vehicule', 'typeCarburant'],
      order: [[require('sequelize').literal('totalMontant'), 'DESC']]
    });

    // Statistiques globales de carburant
    const totalCarburant = await Carburant.sum('quantite', {
      where: dateCondition
    }) || 0;

    const totalMontantCarburant = await Carburant.sum('montantTotal', {
      where: dateCondition
    }) || 0;

    // Répartition par type de carburant
    const parTypeCarburant = await Carburant.findAll({
      attributes: [
        'typeCarburant',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
        [require('sequelize').fn('SUM', require('sequelize').col('quantite')), 'totalQuantite']
      ],
      where: dateCondition,
      group: ['typeCarburant']
    });

    res.json({
      success: true,
      data: {
        parVehicule: carburantParVehicule,
        totalQuantite: totalCarburant,
        totalMontant: totalMontantCarburant,
        parType: parTypeCarburant
      }
    });
  } catch (error) {
    console.error('Erreur lors de la génération du rapport véhicules:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du rapport véhicules',
      error: error.message
    });
  }
};
