const { sequelize } = require('../config/database');

// Obtenir toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const query = `
      SELECT c.*, COUNT(m.id) as nombreMarchandises
      FROM categories c
      LEFT JOIN marchandises m ON c.id = m.categorieId
      GROUP BY c.id, c.nom, c.categorie, c.description
      ORDER BY c.categorie ASC
    `;

    const result = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error.message
    });
  }
};

// Obtenir une catégorie par son ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT c.*, COUNT(m.id) as nombreMarchandises
      FROM categories c
      LEFT JOIN marchandises m ON c.id = m.categorieId
      WHERE c.id = $1
      GROUP BY c.id, c.nom, c.categorie, c.description
    `;

    const result = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: result[0]
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error.message
    });
  }
};

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const { nom, categorie, description } = req.body;

    const query = `
      INSERT INTO categories (nom, categorie, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: [nom, categorie, description],
      type: sequelize.QueryTypes.INSERT
    });

    res.status(201).json({
      success: true,
      message: 'Catégorie créée avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie',
      error: error.message
    });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, categorie, description } = req.body;

    const query = `
      UPDATE categories 
      SET nom = $1, categorie = $2, description = $3
      WHERE id = $4
      RETURNING *
    `;

    const result = await sequelize.query(query, {
      replacements: [nom, categorie, description, id],
      type: sequelize.QueryTypes.UPDATE
    });

    if (result[1] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Catégorie mise à jour avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie',
      error: error.message
    });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si des marchandises utilisent cette catégorie
    const checkQuery = 'SELECT COUNT(*) as count FROM marchandises WHERE categorieId = $1';
    const checkResult = await sequelize.query(checkQuery, {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT
    });

    if (parseInt(checkResult[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Impossible de supprimer cette catégorie car elle est utilisée par des marchandises'
      });
    }

    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    
    const result = await sequelize.query(query, {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE
    });

    if (result[1] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès',
      data: result[0][0]
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie',
      error: error.message
    });
  }
};
