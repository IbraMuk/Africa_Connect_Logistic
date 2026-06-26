const db = require('../config/database-pg');

// Obtenir tous les clients
exports.getAllClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut, type } = req.query;
    const offset = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Construire la requête de base
    let query = `
      SELECT id, nom, prenom, email, telephone, adresse, type, statut, 
             "dateInscription", "dateInscription" as "createdAt", "dateInscription" as "updatedAt"
      FROM clients
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Ajouter la recherche
    if (search) {
      query += ` AND (nom ILIKE $${paramIndex} OR prenom ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Ajouter les filtres
    if (statut) {
      query += ` AND statut = $${paramIndex}`;
      params.push(statut);
      paramIndex++;
    }

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Ajouter l'ordre et la pagination
    query += ` ORDER BY "dateInscription" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limitNum, offset);

    // Exécuter la requête principale
    const result = await db.query(query, params);

    // Compter le total
    let countQuery = 'SELECT COUNT(*) FROM clients WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (nom ILIKE $${countParamIndex} OR prenom ILIKE $${countParamIndex} OR email ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (statut) {
      countQuery += ` AND statut = $${countParamIndex}`;
      countParams.push(statut);
      countParamIndex++;
    }

    if (type) {
      countQuery += ` AND type = $${countParamIndex}`;
      countParams.push(type);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      data: {
        clients: result.rows,
        total: total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limitNum)
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
    const result = await db.query(
      'SELECT * FROM clients WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
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
    const existingClient = await db.query(
      'SELECT id FROM clients WHERE email = $1',
      [email]
    );

    if (existingClient.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Un client avec cet email existe déjà'
      });
    }

    // Insérer le nouveau client
    const result = await db.query(
      `INSERT INTO clients (nom, prenom, email, telephone, adresse, type, "dateInscription")
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [nom, prenom, email, telephone, adresse, type || 'Particulier']
    );

    res.status(201).json({
      success: true,
      message: 'Client créé avec succès',
      data: result.rows[0]
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
    const { nom, prenom, email, telephone, adresse, type, statut } = req.body;
    const clientId = req.params.id;

    // Vérifier si le client existe
    const existingClient = await db.query(
      'SELECT id FROM clients WHERE id = $1',
      [clientId]
    );

    if (existingClient.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

    // Si l'email est modifié, vérifier qu'il n'existe pas déjà
    if (email) {
      const emailCheck = await db.query(
        'SELECT id FROM clients WHERE email = $1 AND id != $2',
        [email, clientId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Un client avec cet email existe déjà'
        });
      }
    }

    // Construire la requête de mise à jour dynamique
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (nom !== undefined) {
      updates.push(`nom = $${paramIndex}`);
      params.push(nom);
      paramIndex++;
    }
    if (prenom !== undefined) {
      updates.push(`prenom = $${paramIndex}`);
      params.push(prenom);
      paramIndex++;
    }
    if (email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      params.push(email);
      paramIndex++;
    }
    if (telephone !== undefined) {
      updates.push(`telephone = $${paramIndex}`);
      params.push(telephone);
      paramIndex++;
    }
    if (adresse !== undefined) {
      updates.push(`adresse = $${paramIndex}`);
      params.push(adresse);
      paramIndex++;
    }
    if (type !== undefined) {
      updates.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }
    if (statut !== undefined) {
      updates.push(`statut = $${paramIndex}`);
      params.push(statut);
      paramIndex++;
    }

    updates.push(`updatedAt = CURRENT_TIMESTAMP`);
    params.push(clientId);

    const query = `
      UPDATE clients 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await db.query(query, params);

    res.json({
      success: true,
      message: 'Client mis à jour avec succès',
      data: result.rows[0]
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
    const result = await db.query(
      'DELETE FROM clients WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Client non trouvé'
      });
    }

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
    // Exécuter toutes les requêtes de statistiques en parallèle
    const [
      totalResult,
      actifsResult,
      entreprisesResult,
      nouveauxResult
    ] = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM clients'),
      db.query('SELECT COUNT(*) as count FROM clients WHERE statut = $1', ['Actif']),
      db.query('SELECT COUNT(*) as count FROM clients WHERE type = $1', ['Entreprise']),
      db.query('SELECT COUNT(*) as count FROM clients WHERE "dateInscription" >= date_trunc(\'month\', CURRENT_DATE)')
    ]);

    const stats = {
      total: parseInt(totalResult.rows[0].count),
      actifs: parseInt(actifsResult.rows[0].count),
      inactifs: parseInt(totalResult.rows[0].count) - parseInt(actifsResult.rows[0].count),
      entreprises: parseInt(entreprisesResult.rows[0].count),
      particuliers: parseInt(totalResult.rows[0].count) - parseInt(entreprisesResult.rows[0].count),
      nouveauxCeMois: parseInt(nouveauxResult.rows[0].count)
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
