const express = require('express');
const router = express.Router();
const itineraireController = require('../controllers/itineraireController');

// Validation middleware
const validateItineraire = (req, res, next) => {
  const { nom, pointDepart, pointArrivee } = req.body;
  
  if (!nom || !pointDepart || !pointArrivee) {
    return res.status(400).json({
      success: false,
      message: 'Les champs nom, pointDepart et pointArrivee sont requis'
    });
  }
  
  next();
};

// Routes
router.get('/', itineraireController.getAllItineraires);
router.get('/stats', itineraireController.getItineraireStats);
router.get('/:id', itineraireController.getItineraireById);
router.post('/', validateItineraire, itineraireController.createItineraire);
router.put('/:id', validateItineraire, itineraireController.updateItineraire);
router.delete('/:id', itineraireController.deleteItineraire);

module.exports = router;
