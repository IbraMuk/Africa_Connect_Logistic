const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Accès non autorisé',
        message: 'Token manquant'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        error: 'Accès non autorisé',
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.statut !== 'actif') {
      return res.status(401).json({
        error: 'Accès non autorisé',
        message: 'Compte inactif'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur auth middleware:', error);
    res.status(401).json({
      error: 'Accès non autorisé',
      message: 'Token invalide'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Accès interdit',
        message: 'Rôle insuffisant'
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
