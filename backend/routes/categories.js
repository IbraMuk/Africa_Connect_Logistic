const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Middleware pour valider les données
const validateCategory = (req, res, next) => {
  const { nom, categorie } = req.body;

  const errors = [];

  if (!nom || nom.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  if (!categorie || categorie.trim().length < 2) {
    errors.push('La catégorie est requise');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors
    });
  }

  next();
};

// Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id/marchandises', categoryController.getMarchandisesByCategory);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validateCategory, categoryController.createCategory);
router.put('/:id', validateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
