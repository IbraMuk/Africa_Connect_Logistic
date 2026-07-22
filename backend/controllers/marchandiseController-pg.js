const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Obtenir toutes les marchandises
exports.getAllMarchandises = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', statut, expediteurId, categorie } = req.query;
    const offset = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Construire la requête de base
    let query = `
      SELECT m.*, 
             c.nom as expediteur_nom, c.prenom as expediteur_prenom, 
             c.email as expediteur_email, c.telephone as expediteur_telephone,
             cat.nom as categorie_nom
      FROM marchandises m
      LEFT JOIN clients c ON m."expediteurId" = c.id
      LEFT JOIN categories cat ON m."categorieId" = cat.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Ajouter la recherche
    if (search) {
      query += ` AND (m.reference ILIKE $${paramIndex} OR m.designation ILIKE $${paramIndex} OR 
                 m."destinataireNom" ILIKE $${paramIndex} OR c.nom ILIKE $${paramIndex} OR c.prenom ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Ajouter le filtre de statut
    if (statut && statut !== 'Tous') {
      query += ` AND m.statut = $${paramIndex}`;
      params.push(statut);
      paramIndex++;
    }

    // Ajouter le filtre d'expéditeur
    if (expediteurId) {
      query += ` AND m."expediteurId" = $${paramIndex}`;
      params.push(expediteurId);
      paramIndex++;
    }

    // Ajouter le filtre de catégorie
    if (categorie && categorie !== 'Toutes') {
      query += ` AND m.categorie = $${paramIndex}`;
      params.push(categorie);
      paramIndex++;
    }

    // Ajouter l'ordre et la pagination
    query += ` ORDER BY m."dateEnvoi" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limitNum, offset);

    // Exécuter la requête principale
    const result = await sequelize.query(query, {
      bind: params,
      type: sequelize.QueryTypes.SELECT
    });

    // Compter le total
    let countQuery = 'SELECT COUNT(*) FROM marchandises m WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;

    if (search) {
      countQuery += ` AND (m.reference ILIKE $${countParamIndex} OR m.designation ILIKE $${countParamIndex} OR 
                      m."destinataireNom" ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
      countParamIndex++;
    }

    if (statut && statut !== 'Tous') {
      countQuery += ` AND m.statut = $${countParamIndex}`;
      countParams.push(statut);
      countParamIndex++;
    }

    if (expediteurId) {
      countQuery += ` AND m."expediteurId" = $${countParamIndex}`;
      countParams.push(expediteurId);
      countParamIndex++;
    }

    if (categorie && categorie !== 'Toutes') {
      countQuery += ` AND m.categorie = $${countParamIndex}`;
      countParams.push(categorie);
      countParamIndex++;
    }

    const countResult = await sequelize.query(countQuery, {
      bind: countParams,
      type: sequelize.QueryTypes.SELECT
    });

    const total = parseInt(countResult[0].count);

    res.json({
      success: true,
      data: {
        marchandises: result,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des marchandises:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des marchandises',
      error: error.message
    });
  }
};

// Obtenir une marchandise par son ID
exports.getMarchandiseById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT m.*, 
             c.nom as expediteur_nom, c.prenom as expediteur_prenom, 
             c.email as expediteur_email, c.telephone as expediteur_telephone,
             c.adresse as expediteur_adresse,
             cat.nom as categorie_nom
      FROM marchandises m
      LEFT JOIN clients c ON m."expediteurId" = c.id
      LEFT JOIN categories cat ON m."categorieId" = cat.id
      WHERE m.id = $1
    `;

    const result = await sequelize.query(query, {
      bind: [id],
      type: sequelize.QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marchandise non trouvée'
      });
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la marchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la marchandise',
      error: error.message
    });
  }
};

// Créer une nouvelle marchandise
exports.createMarchandise = async (req, res) => {
  try {
    const {
      designation,
      categoriePrincipale,
      categorieId,
      codeHS,
      poids,
      volume,
      quantite,
      unite,
      valeurMarchande,
      devise,
      expediteurId,
      destinataireNom,
      destinataireTelephone,
      destinataireEmail,
      destinataireAdresse,
      paysOrigine,
      paysDestination,
      villeDepart,
      villeArrivee,
      adresseRamassage,
      adresseLivraison,
      dateEnvoi,
      dateLivraisonPrevue,
      priorite,
      typeTransport,
      exigencesReglementaires,
      conditionsStockage,
      documentsAssocies,
      instructionsSpeciales,
      observations,
      valeurDeclaree,
      assurance,
      coutTransport
    } = req.body;

    // Générer une référence unique
    const year = new Date().getFullYear();
    const countResult = await sequelize.query(
      'SELECT COUNT(*) as count FROM marchandises WHERE EXTRACT(YEAR FROM "dateEnvoi") = $1',
      {
        bind: [year],
        type: sequelize.QueryTypes.SELECT
      }
    );
    const count = parseInt(countResult[0].count) + 1;
    const reference = `MAR-${year}-${String(count).padStart(3, '0')}`;

    // Générer un numéro de suivi unique
    const numeroSuivi = `ACL${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const query = `
      INSERT INTO marchandises (
        reference, designation, "categoriePrincipale", "categorieId", "codeHS",
        poids, volume, quantite, unite, "valeurMarchande", devise,
        "expediteurId", "destinataireNom", "destinataireTelephone", "destinataireEmail", "destinataireAdresse",
        "paysOrigine", "paysDestination", "villeDepart", "villeArrivee", "adresseRamassage", "adresseLivraison",
        "dateEnvoi", "dateLivraisonPrevue", priorite, "typeTransport",
        "exigencesReglementaires", "conditionsStockage", "documentsAssocies",
        "instructionsSpeciales", observations, "valeurDeclaree", assurance, "numeroSuivi",
        "coutTransport", "createdById", statut
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37
      ) RETURNING *
    `;

    const result = await sequelize.query(query, {
      bind: [
        reference, designation, categoriePrincipale || 'Fini', categorieId ?? null, codeHS ?? null,
        poids, volume, quantite ?? null, unite || 'kg', valeurMarchande ?? null, devise || 'USD',
        expediteurId, destinataireNom, destinataireTelephone, destinataireEmail ?? null, destinataireAdresse ?? null,
        paysOrigine ?? null, paysDestination ?? null, villeDepart ?? null, villeArrivee ?? null, adresseRamassage ?? null, adresseLivraison ?? null,
        dateEnvoi, dateLivraisonPrevue ?? null, priorite ?? 'Normale', typeTransport ?? 'Routier',
        exigencesReglementaires ?? null, conditionsStockage ?? null, documentsAssocies ?? null,
        instructionsSpeciales ?? null, observations ?? null, valeurDeclaree ?? null, assurance ?? false, numeroSuivi,
        coutTransport ?? null, req.user?.id ?? null, req.body.statut || 'En attente'
      ],
      type: sequelize.QueryTypes.INSERT
    });

    res.status(201).json({
      success: true,
      message: 'Marchandise créée avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de la marchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la marchandise',
      error: error.message
    });
  }
};

// Mettre à jour une marchandise
exports.updateMarchandise = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Construire la requête de mise à jour dynamique
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    // Exclure les champs qui ne doivent pas être mis à jour
    const excludedFields = ['id', 'reference', 'createdById', 'dateEnvoi'];
    
    Object.keys(updateData).forEach(key => {
      if (!excludedFields.includes(key) && updateData[key] !== undefined) {
        updateFields.push(`"${key}" = $${paramIndex}`);
        updateValues.push(updateData[key]);
        paramIndex++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    updateValues.push(id);

    const query = `
      UPDATE marchandises 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      bind: updateValues,
      type: sequelize.QueryTypes.UPDATE
    });

    if (result[1] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marchandise non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Marchandise mise à jour avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la marchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la marchandise',
      error: error.message
    });
  }
};

// Supprimer une marchandise
exports.deleteMarchandise = async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM marchandises WHERE id = $1 RETURNING *';
    
    const result = await sequelize.query(query, {
      bind: [id],
      type: sequelize.QueryTypes.DELETE
    });

    if (result[1] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marchandise non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Marchandise supprimée avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la marchandise:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la marchandise',
      error: error.message
    });
  }
};

// Mettre à jour le statut d'une marchandise
exports.updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut, dateLivraisonReelle, chauffeurId, vehiculeId } = req.body;

    const updateFields = ['statut = $1'];
    const updateValues = [statut];
    let paramIndex = 2;

    if (dateLivraisonReelle) {
      updateFields.push(`"dateLivraisonReelle" = $${paramIndex}`);
      updateValues.push(dateLivraisonReelle);
      paramIndex++;
    }

    if (chauffeurId) {
      updateFields.push(`"chauffeurId" = $${paramIndex}`);
      updateValues.push(chauffeurId);
      paramIndex++;
    }

    if (vehiculeId) {
      updateFields.push(`"vehiculeId" = $${paramIndex}`);
      updateValues.push(vehiculeId);
      paramIndex++;
    }

    updateValues.push(id);

    const query = `
      UPDATE marchandises 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      bind: updateValues,
      type: sequelize.QueryTypes.UPDATE
    });

    if (result[1] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Marchandise non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// Obtenir les statistiques des marchandises
exports.getMarchandiseStats = async (req, res) => {
  try {
    const queries = {
      total: 'SELECT COUNT(*) as count FROM marchandises',
      enAttente: 'SELECT COUNT(*) as count FROM marchandises WHERE statut = \'En attente\'',
      enTransit: 'SELECT COUNT(*) as count FROM marchandises WHERE statut = \'En transit\'',
      livre: 'SELECT COUNT(*) as count FROM marchandises WHERE statut = \'Livré\'',
      retarde: 'SELECT COUNT(*) as count FROM marchandises WHERE statut = \'Retardé\'',
      perdu: 'SELECT COUNT(*) as count FROM marchandises WHERE statut = \'Perdu\'',
      ceMois: 'SELECT COUNT(*) as count FROM marchandises WHERE EXTRACT(MONTH FROM "dateEnvoi") = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM "dateEnvoi") = EXTRACT(YEAR FROM CURRENT_DATE)',
      poidsTotal: 'SELECT SUM(poids) as total FROM marchandises WHERE statut IN (\'En transit\', \'Livré\')',
      volumeTotal: 'SELECT SUM(volume) as total FROM marchandises WHERE statut IN (\'En transit\', \'Livré\')',
      revenuTotal: 'SELECT SUM("coutTransport") as total FROM marchandises WHERE "reglementStatut" = \'Payé\''
    };

    const results = await Promise.all(
      Object.values(queries).map(query => 
        sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      )
    );

    // Statistiques par catégorie
    const categorieQuery = `
      SELECT m."categorieId", cat.nom as categorie_nom, COUNT(*) as count, SUM(poids) as "poidsTotal", SUM(m."coutTransport") as "revenuTotal"
      FROM marchandises m
      LEFT JOIN categories cat ON m."categorieId" = cat.id
      GROUP BY m."categorieId", cat.nom
      ORDER BY count DESC
    `;
    const categorieResult = await sequelize.query(categorieQuery, { type: sequelize.QueryTypes.SELECT });

    const stats = {
      total: parseInt(results[0][0].count),
      enAttente: parseInt(results[1][0].count),
      enTransit: parseInt(results[2][0].count),
      livre: parseInt(results[3][0].count),
      retarde: parseInt(results[4][0].count),
      perdu: parseInt(results[5][0].count),
      ceMois: parseInt(results[6][0].count),
      poidsTotal: parseFloat(results[7][0].total) || 0,
      volumeTotal: parseFloat(results[8][0].total) || 0,
      revenuTotal: parseFloat(results[9][0].total) || 0,
      parCategorie: categorieResult
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
