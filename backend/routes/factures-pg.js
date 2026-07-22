const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController-pg');
const factureImportExportController = require('../controllers/factureImportExportController');

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

// Routes pour les factures standards
router.get('/', factureController.getAllFactures);
router.get('/stats', factureController.getFactureStats);
router.get('/:id/pdf', factureController.generateFacturePDF);
router.get('/:id', factureController.getFactureById);
router.post('/', validateFacture, factureController.createFacture);
router.put('/:id', factureController.updateFacture);
router.delete('/:id', factureController.deleteFacture);

// Routes pour les factures import/export
router.post('/import-export/create', factureImportExportController.createFacture);
router.post('/import-export/generate-pdf', factureImportExportController.generateFacturePDF);
router.post('/import-export/create-and-generate', factureImportExportController.createAndGenerateFacture);
router.get('/import-export/all', factureImportExportController.getAllFactures);
router.get('/import-export/:id', factureImportExportController.getFactureById);

module.exports = router;
