const db = require('../config/database-pg');
const pdfService = require('../services/pdfService');

// Obtenir toutes les factures
exports.getAllFactures = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut } = req.query;
    const offset = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Construire la requête
    let query = `
      SELECT f.*, c.nom as client_nom, c.prenom as client_prenom
      FROM factures f
      JOIN clients c ON f."clientId" = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Ajouter la recherche
    if (search) {
      query += ` AND (f.id ILIKE $${paramIndex} OR c.nom ILIKE $${paramIndex} OR c.prenom ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Ajouter le filtre de statut
    if (statut && statut !== 'Tous') {
      query += ` AND f.statut = $${paramIndex}`;
      params.push(statut);
      paramIndex++;
    }

    // Ajouter l'ordre et la pagination
    query += ` ORDER BY f."dateFacture" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limitNum, offset);

    // Exécuter la requête
    const result = await db.query(query, params);

    // Compter le total
    let countQuery = `
      SELECT COUNT(*) 
      FROM factures f
      JOIN clients c ON f."clientId" = c.id
      WHERE 1=1
    `;
    const countParams = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (f.id ILIKE $${countParamIndex} OR c.nom ILIKE $${countParamIndex} OR c.prenom ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (statut && statut !== 'Tous') {
      countQuery += ` AND f.statut = $${countParamIndex}`;
      countParams.push(statut);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        factures: result.rows,
        total: total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des factures:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des factures',
      error: error.message
    });
  }
};

// Obtenir une facture par son ID
exports.getFactureById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT f.*, c.nom as client_nom, c.prenom as client_prenom, c.email, c.telephone, c.adresse
       FROM factures f
       JOIN clients c ON f."clientId" = c.id
       WHERE f.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la facture',
      error: error.message
    });
  }
};

// Créer une nouvelle facture
exports.createFacture = async (req, res) => {
  try {
    const { clientId, dateEcheance, services, notes } = req.body;
    
    // Vérifier si le client existe
    const clientResult = await db.query(
      'SELECT id, nom, prenom FROM clients WHERE id = $1',
      [clientId]
    );

    if (clientResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    // Calculer le montant total
    const montant = services.reduce((total, service) => {
      return total + (service.quantite * service.prix);
    }, 0);

    // Générer le numéro de facture
    const year = new Date().getFullYear();
    const countResult = await db.query(
      'SELECT COUNT(*) as count FROM factures WHERE EXTRACT(YEAR FROM "dateFacture") = $1',
      [year]
    );
    const count = parseInt(countResult.rows[0].count) + 1;
    const numeroFacture = `FAC-${year}-${String(count).padStart(3, '0')}`;

    // Insérer la facture
    const result = await db.query(
      `INSERT INTO factures (id, clientId, "dateFacture", "dateEcheance", montant, statut, services, notes)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, 'En attente', $5, $6)
       RETURNING *`,
      [numeroFacture, clientId, dateEcheance, montant, JSON.stringify(services), notes || null]
    );

    // Récupérer la facture avec les infos du client
    const factureResult = await db.query(
      `SELECT f.*, c.nom as client_nom, c.prenom as client_prenom
       FROM factures f
       JOIN clients c ON f."clientId" = c.id
       WHERE f.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json({
      success: true,
      message: 'Facture créée avec succès',
      data: factureResult.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la facture',
      error: error.message
    });
  }
};

// Mettre à jour une facture
exports.updateFacture = async (req, res) => {
  try {
    const { statut, dateEcheance, services, notes } = req.body;
    const factureId = req.params.id;

    // Vérifier si la facture existe
    const existingFacture = await db.query(
      'SELECT id FROM factures WHERE id = $1',
      [factureId]
    );

    if (existingFacture.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }

    // Construire la requête de mise à jour
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (statut !== undefined) {
      updates.push(`statut = $${paramIndex}`);
      params.push(statut);
      paramIndex++;
    }

    if (dateEcheance !== undefined) {
      updates.push(`dateEcheance = $${paramIndex}`);
      params.push(dateEcheance);
      paramIndex++;
    }

    if (services !== undefined) {
      const montant = services.reduce((total, service) => {
        return total + (service.quantite * service.prix);
      }, 0);
      updates.push(`services = $${paramIndex}, montant = $${paramIndex + 1}`);
      params.push(JSON.stringify(services), montant);
      paramIndex += 2;
    }

    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      params.push(notes);
      paramIndex++;
    }

    updates.push(`updatedAt = CURRENT_TIMESTAMP`);
    params.push(factureId);

    const query = `
      UPDATE factures 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, params);

    // Récupérer la facture mise à jour avec les infos du client
    const factureResult = await db.query(
      `SELECT f.*, c.nom as client_nom, c.prenom as client_prenom
       FROM factures f
       JOIN clients c ON f."clientId" = c.id
       WHERE f.id = $1`,
      [result.rows[0].id]
    );

    res.json({
      success: true,
      message: 'Facture mise à jour avec succès',
      data: factureResult.rows[0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la facture',
      error: error.message
    });
  }
};

// Supprimer une facture
exports.deleteFacture = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM factures WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Facture supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la facture:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la facture',
      error: error.message
    });
  }
};

// Obtenir les statistiques des factures
exports.getFactureStats = async (req, res) => {
  try {
    const [
      totalResult,
      payeesResult,
      enAttenteResult,
      enRetardResult
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as count, COALESCE(SUM(montant), 0) as total FROM factures'),
      db.query('SELECT COUNT(*) as count, COALESCE(SUM(montant), 0) as total FROM factures WHERE statut = $1', ['Payée']),
      db.query('SELECT COUNT(*) as count, COALESCE(SUM(montant), 0) as total FROM factures WHERE statut = $1', ['En attente']),
      db.query('SELECT COUNT(*) as count, COALESCE(SUM(montant), 0) as total FROM factures WHERE statut = $1 AND dateEcheance < CURRENT_DATE', ['En attente'])
    ]);

    const stats = {
      total: {
        count: parseInt(totalResult.rows[0].count),
        montant: parseFloat(totalResult.rows[0].total)
      },
      payees: {
        count: parseInt(payeesResult.rows[0].count),
        montant: parseFloat(payeesResult.rows[0].total)
      },
      enAttente: {
        count: parseInt(enAttenteResult.rows[0].count),
        montant: parseFloat(enAttenteResult.rows[0].total)
      },
      enRetard: {
        count: parseInt(enRetardResult.rows[0].count),
        montant: parseFloat(enRetardResult.rows[0].total)
      }
    };

    res.json({
      success: true,
      data: stats
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

// Générer le PDF d'une facture
exports.generateFacturePDF = async (req, res) => {
  try {
    const factureId = req.params.id;
    
    // Récupérer les détails de la facture
    const result = await db.query(
      `SELECT f.*, c.nom as client_nom, c.prenom as client_prenom, c.email, c.telephone, c.adresse
       FROM factures f
       JOIN clients c ON f."clientId" = c.id
       WHERE f.id = $1`,
      [factureId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Facture non trouvée'
      });
    }

    const facture = result.rows[0];
    
    // Parser les services si c'est une chaîne
    if (typeof facture.services === 'string') {
      facture.services = JSON.parse(facture.services);
    }

    // Générer le PDF
    const pdfBuffer = await pdfService.generateFacturePDF(facture);
    
    // Envoyer le PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=facture-${factureId}.pdf`);
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du PDF',
      error: error.message
    });
  }
};
