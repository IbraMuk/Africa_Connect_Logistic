const express = require('express');
const router = express.Router();
const approvisionnementController = require('../controllers/approvisionnementController');

// Validation middleware
const validateApprovisionnement = (req, res, next) => {
  const { reference, fournisseur, article, quantite, prixUnitaire, dateCommande } = req.body;
  
  if (!reference || !fournisseur || !article || !quantite || !prixUnitaire || !dateCommande) {
    return res.status(400).json({
      success: false,
      message: 'Les champs reference, fournisseur, article, quantite, prixUnitaire et dateCommande sont requis'
    });
  }
  
  next();
};

// Routes
router.get('/', approvisionnementController.getAllApprovisionnements);
router.get('/stats', approvisionnementController.getApprovisionnementStats);
router.get('/:id', approvisionnementController.getApprovisionnementById);
router.post('/', validateApprovisionnement, approvisionnementController.createApprovisionnement);
router.put('/:id', validateApprovisionnement, approvisionnementController.updateApprovisionnement);
router.delete('/:id', approvisionnementController.deleteApprovisionnement);

module.exports = router;
