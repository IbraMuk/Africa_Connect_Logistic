const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController-pg');

// Middleware pour valider les données
const validateFacture = (req, res, next) => {
  const { clientId, dateEcheance, services } = req.body;
  
  if (!clientId || !dateEcheance || !services || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Les champs clientId, dateEcheance et services sont obligatoires'
    });
  }
  
  // Valider chaque service
  for (const service of services) {
    if (!service.description || !service.quantite || !service.prix) {
      return res.status(400).json({
        success: false,
        message: 'Chaque service doit avoir une description, une quantité et un prix'
      });
    }
  }
  
  next();
};

// Routes
router.get('/', factureController.getAllFactures);
// Routes pour les statistiques
router.get('/stats', factureController.getFactureStats);

// Route pour générer le PDF d'une facture
router.get('/:id/pdf', factureController.generateFacturePDF);
router.get('/:id', factureController.getFactureById);
router.post('/', validateFacture, factureController.createFacture);
router.put('/:id', factureController.updateFacture);
router.delete('/:id', factureController.deleteFacture);

module.exports = router;
