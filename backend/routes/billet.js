const express = require('express');
const { auth } = require('../middleware/auth');
const {
  createBillet,
  getBillets,
  getBilletByReference,
  cancelBillet
} = require('../controllers/billetController');

const router = express.Router();

router.post('/', auth, createBillet);
router.get('/', auth, getBillets);
router.get('/reference/:reference', getBilletByReference);
router.patch('/:id/cancel', auth, cancelBillet);

module.exports = router;
