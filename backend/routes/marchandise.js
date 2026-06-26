const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createTransport,
  getTransports,
  getTransportById,
  updateStatut
} = require('../controllers/marchandiseController');

const router = express.Router();

router.post('/', auth, createTransport);
router.get('/', auth, getTransports);
router.get('/:id', auth, getTransportById);
router.patch('/:id/statut', auth, updateStatut);

module.exports = router;
