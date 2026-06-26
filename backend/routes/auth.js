const express = require('express');
const { auth } = require('../middleware/auth');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

const router = express.Router();

// Route publique
router.post('/register', register);
router.post('/login', login);

// Routes protégées
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;
