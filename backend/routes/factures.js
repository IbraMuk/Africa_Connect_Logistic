const express = require('express');
const router = express.Router();
const factureController = require('../controllers/factureController');
const factureImportExportController = require('../controllers/factureImportExportController');

const validateFacture = (req, res, next) => {
  const { clientId, dateEcheance, services } = req.body;
  if (!clientId || !dateEcheance || !Array.isArray(services) || services.length === 0) {
    return res.status(400).json({ success: false, message: 'clientId, dateEcheance et services sont obligatoires' });
  }
  for (const s of services) {
    if (!s.description || !s.quantite || !s.prix) {
      return res.status(400).json({ success: false, message: 'Chaque service doit avoir une description, une quantité et un prix' });
    }
  }
  next();
};

// Routes pour les factures import/export (doivent précéder les routes génériques /:id)
router.post('/import-export/create', factureImportExportController.createFacture);
router.post('/import-export/generate-pdf', factureImportExportController.generateFacturePDF);
router.post('/import-export/create-and-generate', factureImportExportController.createAndGenerateFacture);
router.get('/import-export/all', factureImportExportController.getAllFactures);
router.get('/import-export/:id', factureImportExportController.getFactureById);

// Routes pour les factures standards
router.get('/stats', factureController.getFactureStats);
router.get('/:id/pdf', factureController.generateFacturePDF);
router.get('/:id', factureController.getFactureById);
router.get('/', factureController.getAllFactures);
router.post('/', validateFacture, factureController.createFacture);
router.put('/:id', factureController.updateFacture);
router.delete('/:id', factureController.deleteFacture);

module.exports = router;
