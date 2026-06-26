const express = require('express');
const router = express.Router();
const rapportController = require('../controllers/rapportController');

// Routes
router.get('/financiers', rapportController.getRapportFinancier);
router.get('/factures', rapportController.getRapportFactures);
router.get('/depenses', rapportController.getRapportDepenses);
router.get('/activite', rapportController.getRapportActivite);
router.get('/clients', rapportController.getRapportClients);
router.get('/vehicules', rapportController.getRapportVehicules);

module.exports = router;
