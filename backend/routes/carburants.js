const express = require('express');
const router = express.Router();
const carburantController = require('../controllers/carburantController');

// Validation middleware
const validateCarburant = (req, res, next) => {
  const { vehicule, typeCarburant, quantite, prixUnitaire, date } = req.body;
  
  if (!vehicule || !typeCarburant || !quantite || !prixUnitaire || !date) {
    return res.status(400).json({
      success: false,
      message: 'Les champs vehicule, typeCarburant, quantite, prixUnitaire et date sont requis'
    });
  }
  
  next();
};

// Routes
router.get('/', carburantController.getAllCarburants);
router.get('/stats', carburantController.getCarburantStats);
router.get('/:id', carburantController.getCarburantById);
router.post('/', validateCarburant, carburantController.createCarburant);
router.put('/:id', validateCarburant, carburantController.updateCarburant);
router.delete('/:id', carburantController.deleteCarburant);

module.exports = router;
