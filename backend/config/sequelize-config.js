// Configuration globale pour éviter les problèmes de timestamps
module.exports = {
  // Désactiver globalement les timestamps automatiques
  define: {
    timestamps: false,
    underscored: false,
    freezeTableName: true,
    // Ne pas ajouter createdAt/updatedAt automatiquement
    createdAt: false,
    updatedAt: false
  },
  // Configuration pour la synchronisation
  sync: {
    force: false,
    alter: true,
    logging: console.log
  }
};
