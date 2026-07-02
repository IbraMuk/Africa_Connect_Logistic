const { Facture, Client } = require('../models/index');
const { Op } = require('sequelize');
const pdfService = require('../services/pdfService');

// Générer un numéro de facture unique

// GET /api/factures
exports.getAllFactures = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', statut } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (statut && statut !== 'Tous') where.statut = statut;

    const clientWhere = {};
    if (search) {
      clientWhere[Op.or] = [
        { nom: { [Op.like]: `%${search}%` } },
        { prenom: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: factures, count: total } = await Facture.findAndCountAll({
      where: search ? {} : where,
      include: [{
        model: Client,
        as: 'client',
        attributes: ['id', 'nom', 'prenom', 'email', 'telephone'],
        where: search ? clientWhere : undefined,
        required: !!search,
      }],
      order: [['dateFacture', 'DESC']],
      limit: parseInt(limit),
      offset,
    });

    const data = factures.map(f => ({
      id: f.id,
      clientId: f.clientId,
      clientNom: f.client?.nom,
      clientPrenom: f.client?.prenom,
      dateFacture: f.dateFacture,
      dateEcheance: f.dateEcheance,
      montant: parseFloat(f.montant),
      statut: f.statut,
      services: typeof f.services === 'string' ? JSON.parse(f.services) : f.services,
      notes: f.notes,
    }));

    res.json({
      success: true,
      data: { factures: data, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    console.error('getAllFactures:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/factures/stats
exports.getFactureStats = async (req, res) => {
  try {
    const { sequelize: db } = require('../config/database');
    const [rows] = await db.query(`
      SELECT
        COUNT(*) as totalCount,
        COALESCE(SUM(CAST(montant AS REAL)), 0) as totalMontant,
        COALESCE(SUM(CASE WHEN statut = 'Payée' THEN CAST(montant AS REAL) ELSE 0 END), 0) as payeesMontant,
        COALESCE(SUM(CASE WHEN statut = 'En attente' THEN CAST(montant AS REAL) ELSE 0 END), 0) as attenteM,
        COALESCE(SUM(CASE WHEN statut = 'En retard' THEN CAST(montant AS REAL) ELSE 0 END), 0) as retardM,
        COUNT(CASE WHEN statut = 'Payée' THEN 1 END) as payeesCount,
        COUNT(CASE WHEN statut = 'En attente' THEN 1 END) as attenteCount,
        COUNT(CASE WHEN statut = 'En retard' THEN 1 END) as retardCount
      FROM factures
    `);
    const r = rows[0];
    res.json({
      success: true,
      data: {
        total: { count: r.totalCount, montant: r.totalMontant },
        payees: { count: r.payeesCount, montant: r.payeesMontant },
        enAttente: { count: r.attenteCount, montant: r.attenteM },
        enRetard: { count: r.retardCount, montant: r.retardM },
      },
    });
  } catch (error) {
    console.error('getFactureStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/factures/:id
exports.getFactureById = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id, {
      include: [{ model: Client, as: 'client' }],
    });
    if (!facture) return res.status(404).json({ success: false, message: 'Facture non trouvée' });

    res.json({
      success: true,
      data: {
        ...facture.toJSON(),
        services: typeof facture.services === 'string' ? JSON.parse(facture.services) : facture.services,
      },
    });
  } catch (error) {
    console.error('getFactureById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// POST /api/factures
exports.createFacture = async (req, res) => {
  try {
    const { clientId, dateEcheance, services, notes } = req.body;

    const client = await Client.findByPk(clientId);
    if (!client) return res.status(400).json({ success: false, message: 'Client non trouvé' });

    const montant = services.reduce((sum, s) => sum + (parseFloat(s.quantite) || 0) * (parseFloat(s.prix) || 0), 0);

    const year = new Date().getFullYear();
    const count = await Facture.count();
    const id = `FAC-${year}-${String(count + 1).padStart(4, '0')}`;

    const facture = await Facture.create({
      id,
      clientId,
      dateEcheance,
      montant,
      services: JSON.stringify(services),
      notes: notes || null,
      statut: 'En attente',
    });

    res.status(201).json({
      success: true,
      message: 'Facture créée avec succès',
      data: {
        ...facture.toJSON(),
        clientNom: client.nom,
        clientPrenom: client.prenom,
        services,
      },
    });
  } catch (error) {
    console.error('createFacture:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// PUT /api/factures/:id
exports.updateFacture = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id);
    if (!facture) return res.status(404).json({ success: false, message: 'Facture non trouvée' });

    const { statut, dateEcheance, services, notes } = req.body;
    const updates = {};
    if (statut !== undefined) updates.statut = statut;
    if (dateEcheance !== undefined) updates.dateEcheance = dateEcheance;
    if (notes !== undefined) updates.notes = notes;
    if (services !== undefined) {
      updates.services = JSON.stringify(services);
      updates.montant = services.reduce((sum, s) => sum + (parseFloat(s.quantite) || 0) * (parseFloat(s.prix) || 0), 0);
    }

    await facture.update(updates);
    res.json({ success: true, message: 'Facture mise à jour', data: facture.toJSON() });
  } catch (error) {
    console.error('updateFacture:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// DELETE /api/factures/:id
exports.deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id);
    if (!facture) return res.status(404).json({ success: false, message: 'Facture non trouvée' });
    await facture.destroy();
    res.json({ success: true, message: 'Facture supprimée' });
  } catch (error) {
    console.error('deleteFacture:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
  }
};

// GET /api/factures/:id/pdf
exports.generateFacturePDF = async (req, res) => {
  try {
    const facture = await Facture.findByPk(req.params.id, {
      include: [{ model: Client, as: 'client' }],
    });
    if (!facture) return res.status(404).json({ success: false, message: 'Facture non trouvée' });

    const data = facture.toJSON();
    data.services = typeof data.services === 'string' ? JSON.parse(data.services) : data.services || [];
    data.client_nom = data.client?.nom;
    data.client_prenom = data.client?.prenom;
    data.email = data.client?.email;
    data.telephone = data.client?.telephone;
    data.adresse = data.client?.adresse;

    const pdfBuffer = await pdfService.generateFacturePDF(data);
    const buffer = Buffer.isBuffer(pdfBuffer) ? pdfBuffer : Buffer.from(pdfBuffer);
    res.type('application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="facture-${facture.id}.pdf"`);
    res.end(buffer);
  } catch (error) {
    console.error('generateFacturePDF:', error);
    res.status(500).json({ success: false, message: 'Erreur génération PDF', error: error.message });
  }
};
