const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// Validation middleware
const validateMaintenance = (req, res, next) => {
  const { equipement, description, dateDebut } = req.body;
  
  if (!equipement || !description || !dateDebut) {
    return res.status(400).json({
      success: false,
      message: 'Les champs equipement, description et dateDebut sont requis'
    });
  }
  
  next();
};

// Routes
router.get('/', maintenanceController.getAllMaintenances);
router.get('/stats', maintenanceController.getMaintenanceStats);
router.get('/:id', maintenanceController.getMaintenanceById);
router.post('/', validateMaintenance, maintenanceController.createMaintenance);
router.put('/:id', validateMaintenance, maintenanceController.updateMaintenance);
router.delete('/:id', maintenanceController.deleteMaintenance);

module.exports = router;
