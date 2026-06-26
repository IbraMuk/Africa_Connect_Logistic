const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController-pg');

// Middleware pour valider les données
const validateClient = (req, res, next) => {
  const { nom, prenom, email, telephone } = req.body;
  
  if (!nom || !prenom || !email || !telephone) {
    return res.status(400).json({
      success: false,
      message: 'Les champs nom, prénom, email et téléphone sont obligatoires'
    });
  }
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email invalide'
    });
  }
  
  next();
};

// Routes
router.get('/', clientController.getAllClients);
router.get('/stats', clientController.getClientStats);
router.get('/:id', clientController.getClientById);
router.post('/', validateClient, clientController.createClient);
router.put('/:id', validateClient, clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
