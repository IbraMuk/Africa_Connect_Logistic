const Client = require('../models/Client');
const { Op } = require('sequelize');

// Obtenir tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut, type } = req.query;
    const offset = (page - 1) * limit;

    // Construire la condition de recherche
    const whereCondition = {
      [Op.or]: [
        { nom: { [Op.like]: `%${search}%` } },
        { prenom: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };

    // Ajouter les filtres si présents
    if (statut) whereCondition.statut = statut;
    if (type) whereCondition.type = type;

    const { count, rows: clients } = await Client.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['dateInscription', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        clients,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des clients',
      error: error.message
    });
  }
};

// Obtenir un client par son ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du client',
      error: error.message
    });
  }
};

// Créer un nouveau client
exports.createClient = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, adresse, type } = req.body;

    // Vérifier si l'email existe déjà
    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Un client avec cet email existe déjà'
      });
    }

    const client = await Client.create({
      nom,
      prenom,
      email,
      telephone,
      adresse,
      type,
      statut: 'Actif',
      dateInscription: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la création du client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du client',
      error: error.message
    });
  }
};

// Mettre à jour un client
exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (req.body.email && req.body.email !== client.email) {
      const existingClient = await Client.findOne({ where: { email: req.body.email } });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: 'Un client avec cet email existe déjà'
        });
      }
    }

    await client.update(req.body);

    res.json({
      success: true,
      message: 'Client mis à jour avec succès',
      data: client
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du client',
      error: error.message
    });
  }
};

// Supprimer un client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    await client.destroy();

    res.json({
      success: true,
      message: 'Client supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du client',
      error: error.message
    });
  }
};

// Obtenir les statistiques des clients
exports.getClientStats = async (req, res) => {
  try {
    const totalClients = await Client.count();
    const clientsActifs = await Client.count({ where: { statut: 'Actif' } });
    const clientsInactifs = await Client.count({ where: { statut: 'Inactif' } });
    const entreprises = await Client.count({ where: { type: 'Entreprise' } });
    const particuliers = await Client.count({ where: { type: 'Particulier' } });

    // Nouveaux clients ce mois
    const debutMois = new Date();
    debutMois.setDate(1);
    debutMois.setHours(0, 0, 0, 0);
    const nouveauxCeMois = await Client.count({
      where: {
        dateInscription: {
          [Op.gte]: debutMois
        }
      }
    });

    res.json({
      success: true,
      data: {
        total: totalClients,
        actifs: clientsActifs,
        inactifs: clientsInactifs,
        entreprises,
        particuliers,
        nouveauxCeMois
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
