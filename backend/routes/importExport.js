const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createOperation,
  getOperations,
  trackOperation,
  updateStatut
} = require('../controllers/importExportController');

const router = express.Router();

router.post('/', auth, createOperation);
router.get('/', auth, getOperations);
router.get('/track/:numeroSuivi', trackOperation);
router.patch('/:id/statut', auth, updateStatut);

module.exports = router;
