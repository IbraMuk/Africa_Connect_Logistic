const jwt = require('jsonwebtoken');
const { User } = require('../models');
const Joi = require('joi');

// Schémas de validation
const registerSchema = Joi.object({
  nom: Joi.string().min(2).max(50).required(),
  prenom: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  telephone: Joi.string().min(8).max(20).optional(),
  role: Joi.string().valid('client', 'chauffeur').default('client')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Génération de token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Inscription
const register = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    const { email } = value;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'Erreur d\'inscription',
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer l'utilisateur
    const user = await User.create(value);
    
    // Générer le token
    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'Inscription réussie',
      user,
      token
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de créer le compte'
    });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Données invalides',
        message: error.details[0].message
      });
    }

    const { email, password } = value;
    
    // Trouver l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Erreur de connexion',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Erreur de connexion',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le statut du compte
    if (user.statut !== 'actif') {
      return res.status(401).json({
        error: 'Erreur de connexion',
        message: 'Compte inactif'
      });
    }

    // Générer le token
    const token = generateToken(user.id);
    
    res.json({
      message: 'Connexion réussie',
      user,
      token
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de se connecter'
    });
  }
};

// Obtenir le profil utilisateur
const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Erreur getProfile:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de récupérer le profil'
    });
  }
};

// Mettre à jour le profil
const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;
    
    await req.user.update({
      nom,
      prenom,
      telephone
    });
    
    res.json({
      message: 'Profil mis à jour avec succès',
      user: req.user
    });
  } catch (error) {
    console.error('Erreur updateProfile:', error);
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Impossible de mettre à jour le profil'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};
