const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  createTransport,
  getTransports,
  getTransportById,
  updateTransport,
  cancelTransport,
  getAllTransports
} = require('../controllers/personnelController');

const router = express.Router();

// Routes pour tous les utilisateurs authentifiés
router.post('/', auth, createTransport);
router.get('/', auth, getTransports);
router.get('/:id', auth, getTransportById);
router.put('/:id', auth, updateTransport);
router.patch('/:id/cancel', auth, cancelTransport);

// Routes pour admin et gestionnaire
router.get('/all/list', auth, authorize('admin', 'gestionnaire'), getAllTransports);

module.exports = router;
