const express = require('express');
const router = express.Router();
const merchandiseController = require('../controllers/marchandiseController-pg');

// Middleware pour valider les données
const validateMarchandise = (req, res, next) => {
  const {
    designation,
    poids,
    volume,
    expediteurId,
    destinataireNom,
    destinataireTelephone,
    villeDepart,
    villeArrivee,
    dateEnvoi
  } = req.body;

  const errors = [];

  if (!designation || designation.trim().length < 3) {
    errors.push('La designation doit contenir au moins 3 caractères');
  }

  if (!poids || poids <= 0) {
    errors.push('Le poids doit être supérieur à 0');
  }

  if (!volume || volume <= 0) {
    errors.push('Le volume doit être supérieur à 0');
  }

  if (!expediteurId) {
    errors.push('L\'expéditeur est requis');
  }

  if (!destinataireNom || destinataireNom.trim().length < 2) {
    errors.push('Le nom du destinataire est requis');
  }

  if (!destinataireTelephone || destinataireTelephone.trim().length < 8) {
    errors.push('Le téléphone du destinataire est invalide');
  }

  if (!villeDepart || villeDepart.trim().length < 2) {
    errors.push('La ville de départ est requise');
  }

  if (!villeArrivee || villeArrivee.trim().length < 2) {
    errors.push('La ville d\'arrivée est requise');
  }

  if (!dateEnvoi) {
    errors.push('La date d\'envoi est requise');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors
    });
  }

  next();
};

// Routes
router.get('/', merchandiseController.getAllMarchandises);
router.get('/stats', merchandiseController.getMarchandiseStats);
router.get('/:id', merchandiseController.getMarchandiseById);
router.post('/', validateMarchandise, merchandiseController.createMarchandise);
router.put('/:id', merchandiseController.updateMarchandise);
router.delete('/:id', merchandiseController.deleteMarchandise);
router.patch('/:id/statut', merchandiseController.updateStatut);

module.exports = router;
