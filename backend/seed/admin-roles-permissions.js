const { Role, Permission, RolePermission } = require('../models');

const roleDefinitions = [
  {
    nom: 'Super Admin',
    code: 'super-admin',
    description: 'Accès complet au système, y compris les restaurations et configurations critiques.',
  },
  {
    nom: 'Administrateur',
    code: 'administrateur',
    description: 'Supervise l\'ensemble du système et gère les utilisateurs.',
  },
  {
    nom: 'Manager Logistique',
    code: 'manager-logistique',
    description: 'Gère les opérations de transport, les itinéraires et les véhicules.',
  },
  {
    nom: 'Agent de Réservation',
    code: 'agent-reservation',
    description: 'Gère les ventes et réservations de billets.',
  },
  {
    nom: 'Client',
    code: 'client',
    description: 'Réserve des billets ou demande des services logistiques.',
  },
  {
    nom: 'Comptable / Financier',
    code: 'comptable',
    description: 'Supervise les transactions et rapports financiers.',
  },
  {
    nom: 'Support Technique / Service Client',
    code: 'support',
    description: 'Assiste les utilisateurs et résout les problèmes.',
  },
];

const permissionDefinitions = [
  // Dashboard
  { nom: 'Tableau de bord - Lecture', code: 'dashboard.read', description: 'Consulter le tableau de bord' },

  // Utilisateurs
  { nom: 'Utilisateurs - Lecture', code: 'users.read', description: 'Consulter les utilisateurs' },
  { nom: 'Utilisateurs - Écriture', code: 'users.write', description: 'Créer/modifier des utilisateurs' },
  { nom: 'Utilisateurs - Suppression', code: 'users.delete', description: 'Supprimer des utilisateurs' },
  { nom: 'Utilisateurs - Administration', code: 'users.admin', description: 'Gérer les rôles et permissions' },

  // Clients
  { nom: 'Clients - Lecture', code: 'clients.read', description: 'Consulter les clients' },
  { nom: 'Clients - Écriture', code: 'clients.write', description: 'Créer/modifier les clients' },
  { nom: 'Clients - Suppression', code: 'clients.delete', description: 'Supprimer les clients' },

  // Marchandises
  { nom: 'Marchandises - Lecture', code: 'marchandises.read', description: 'Consulter les marchandises' },
  { nom: 'Marchandises - Écriture', code: 'marchandises.write', description: 'Créer/modifier les marchandises' },
  { nom: 'Marchandises - Suppression', code: 'marchandises.delete', description: 'Supprimer les marchandises' },

  // Catégories
  { nom: 'Catégories - Lecture', code: 'categories.read', description: 'Consulter les catégories' },
  { nom: 'Catégories - Écriture', code: 'categories.write', description: 'Créer/modifier les catégories' },
  { nom: 'Catégories - Suppression', code: 'categories.delete', description: 'Supprimer les catégories' },

  // Tracking
  { nom: 'Tracking - Lecture', code: 'tracking.read', description: 'Suivre les colis' },
  { nom: 'Tracking - Écriture', code: 'tracking.write', description: 'Mettre à jour le suivi' },

  // Facturation
  { nom: 'Facturation - Lecture', code: 'facturation.read', description: 'Consulter les factures' },
  { nom: 'Facturation - Écriture', code: 'facturation.write', description: 'Créer/modifier les factures' },
  { nom: 'Facturation - Suppression', code: 'facturation.delete', description: 'Supprimer les factures' },

  // Transport
  { nom: 'Transport - Lecture', code: 'transport.read', description: 'Consulter le transport' },
  { nom: 'Transport - Écriture', code: 'transport.write', description: 'Planifier/assigner le transport' },
  { nom: 'Transport - Suppression', code: 'transport.delete', description: 'Supprimer les transports' },

  // Billetterie
  { nom: 'Billetterie - Lecture', code: 'billetterie.read', description: 'Consulter les réservations' },
  { nom: 'Billetterie - Écriture', code: 'billetterie.write', description: 'Créer/modifier les réservations' },
  { nom: 'Billetterie - Suppression', code: 'billetterie.delete', description: 'Supprimer les réservations' },

  // Import/Export
  { nom: 'Import/Export - Lecture', code: 'import-export.read', description: 'Consulter les opérations' },
  { nom: 'Import/Export - Écriture', code: 'import-export.write', description: 'Créer/modifier les opérations' },
  { nom: 'Import/Export - Suppression', code: 'import-export.delete', description: 'Supprimer les opérations' },

  // Services généraux
  { nom: 'Services généraux - Lecture', code: 'services-generaux.read', description: 'Consulter les services généraux' },
  { nom: 'Services généraux - Écriture', code: 'services-generaux.write', description: 'Créer/modifier les services généraux' },
  { nom: 'Services généraux - Suppression', code: 'services-generaux.delete', description: 'Supprimer les services généraux' },

  // Rapports
  { nom: 'Rapports - Lecture', code: 'rapports.read', description: 'Consulter les rapports' },
  { nom: 'Rapports - Écriture', code: 'rapports.write', description: 'Générer des rapports' },
  { nom: 'Rapports - Administration', code: 'rapports.admin', description: 'Gérer les rapports' },

  // Administration
  { nom: 'Administration - Lecture', code: 'administration.read', description: 'Consulter les rôles/permissions' },
  { nom: 'Administration - Écriture', code: 'administration.write', description: 'Créer/modifier les rôles/permissions' },
  { nom: 'Administration - Administration', code: 'administration.admin', description: 'Gérer l\'administration' },

  // Paramètres globaux
  { nom: 'Paramètres - Lecture', code: 'settings.read', description: 'Consulter les paramètres' },
  { nom: 'Paramètres - Écriture', code: 'settings.write', description: 'Modifier les paramètres' },
  { nom: 'Paramètres - Administration', code: 'settings.admin', description: 'Gérer les paramètres globaux' },

  // Support / tickets
  { nom: 'Support - Lecture', code: 'support.read', description: 'Consulter les tickets d\'assistance' },
  { nom: 'Support - Écriture', code: 'support.write', description: 'Modifier le statut des demandes' },
  { nom: 'Support - Suppression', code: 'support.delete', description: 'Supprimer les tickets' },
];

const rolePermissionMap = {
  'super-admin': [
    'dashboard.read', 'users.read', 'users.write', 'users.delete', 'users.admin',
    'clients.read', 'clients.write', 'clients.delete',
    'marchandises.read', 'marchandises.write', 'marchandises.delete',
    'categories.read', 'categories.write', 'categories.delete',
    'tracking.read', 'tracking.write',
    'facturation.read', 'facturation.write', 'facturation.delete',
    'transport.read', 'transport.write', 'transport.delete',
    'billetterie.read', 'billetterie.write', 'billetterie.delete',
    'import-export.read', 'import-export.write', 'import-export.delete',
    'services-generaux.read', 'services-generaux.write', 'services-generaux.delete',
    'rapports.read', 'rapports.write', 'rapports.admin',
    'administration.read', 'administration.write', 'administration.admin',
    'settings.read', 'settings.write', 'settings.admin',
    'support.read', 'support.write', 'support.delete',
  ],
  'administrateur': [
    'dashboard.read',
    'users.read', 'users.write', 'users.delete', 'users.admin',
    'clients.read', 'clients.write', 'clients.delete',
    'marchandises.read', 'marchandises.write', 'marchandises.delete',
    'categories.read', 'categories.write', 'categories.delete',
    'tracking.read', 'tracking.write',
    'facturation.read', 'facturation.write', 'facturation.delete',
    'transport.read', 'transport.write', 'transport.delete',
    'billetterie.read', 'billetterie.write', 'billetterie.delete',
    'import-export.read', 'import-export.write', 'import-export.delete',
    'services-generaux.read', 'services-generaux.write', 'services-generaux.delete',
    'rapports.read', 'rapports.write', 'rapports.admin',
    'administration.read', 'administration.write', 'administration.admin',
    'settings.read', 'settings.write', 'settings.admin',
    'support.read', 'support.write',
  ],
  'manager-logistique': [
    'dashboard.read',
    'clients.read',
    'marchandises.read', 'marchandises.write', 'marchandises.delete',
    'tracking.read', 'tracking.write',
    'transport.read', 'transport.write', 'transport.delete',
    'import-export.read', 'import-export.write',
    'rapports.read', 'rapports.write',
  ],
  'agent-reservation': [
    'dashboard.read',
    'clients.read', 'clients.write',
    'billetterie.read', 'billetterie.write', 'billetterie.delete',
    'facturation.read',
    'rapports.read',
  ],
  'client': [
    'dashboard.read',
    'billetterie.read', 'billetterie.write',
    'import-export.read', 'import-export.write',
    'tracking.read',
    'support.read', 'support.write',
  ],
  'comptable': [
    'dashboard.read',
    'clients.read',
    'facturation.read', 'facturation.write', 'facturation.delete',
    'rapports.read', 'rapports.write', 'rapports.admin',
    'billetterie.read',
  ],
  'support': [
    'dashboard.read',
    'clients.read', 'clients.write',
    'support.read', 'support.write', 'support.delete',
    'billetterie.read',
    'rapports.read',
  ],
};

async function seedRolesAndPermissions() {
  try {
    // 1. Créer les permissions si elles n'existent pas
    const permissionMap = {};
    for (const p of permissionDefinitions) {
      const [permission, created] = await Permission.findOrCreate({
        where: { code: p.code },
        defaults: p,
      });
      permissionMap[p.code] = permission.id;
      if (created) console.log(`Permission créée: ${p.code}`);
    }

    // 2. Créer les rôles si ils n'existent pas
    const roleMap = {};
    for (const r of roleDefinitions) {
      const [role, created] = await Role.findOrCreate({
        where: { code: r.code },
        defaults: { nom: r.nom, description: r.description, statut: 'actif' },
      });
      roleMap[r.code] = role.id;
      if (created) console.log(`Rôle créé: ${r.nom}`);
    }

    // 3. Assigner les permissions aux rôles
    for (const [roleCode, permissionCodes] of Object.entries(rolePermissionMap)) {
      const roleId = roleMap[roleCode];
      if (!roleId) continue;
      for (const code of permissionCodes) {
        const permissionId = permissionMap[code];
        if (!permissionId) continue;
        await RolePermission.findOrCreate({
          where: { roleId, permissionId },
          defaults: { roleId, permissionId },
        });
      }
    }

    console.log('✓ Rôles et permissions initialisés');
  } catch (error) {
    console.error('Erreur seed rôles/permissions:', error);
  }
}

module.exports = { seedRolesAndPermissions };
