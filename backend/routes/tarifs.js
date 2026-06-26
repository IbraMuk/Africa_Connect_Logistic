const express = require('express');
const router = express.Router();
const tarifController = require('../controllers/tarifController');

// Validation middleware
const validateTarif = (req, res, next) => {
  const { itineraireId, classe, prix } = req.body;
  
  if (!itineraireId || !classe || !prix) {
    return res.status(400).json({
      success: false,
      message: 'Les champs itineraireId, classe et prix sont requis'
    });
  }
  
  next();
};

// Routes
router.get('/', tarifController.getAllTarifs);
router.get('/stats', tarifController.getTarifStats);
router.get('/:id', tarifController.getTarifById);
router.post('/', validateTarif, tarifController.createTarif);
router.put('/:id', validateTarif, tarifController.updateTarif);
router.delete('/:id', tarifController.deleteTarif);

module.exports = router;
