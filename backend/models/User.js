const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [8, 20]
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'client', 'chauffeur', 'gestionnaire'),
    defaultValue: 'client'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'suspendu'),
    defaultValue: 'actif'
  }
}, {
  tableName: 'users',
  timestamps: false,
  createdAt: false,
  updatedAt: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Méthode pour vérifier le mot de passe
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Méthode pour masquer le mot de passe dans les réponses JSON
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
