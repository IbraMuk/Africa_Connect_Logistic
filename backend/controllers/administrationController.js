const { User, Role, Permission, RolePermission, AuditLog } = require('../models');
const { logAction } = require('../utils/auditLogger');

// ===================== USERS =====================

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['nom', 'ASC']],
      attributes: { exclude: ['password'] }
    });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Erreur getUserById:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération de l\'utilisateur', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, telephone, role, statut } = req.body;
    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nom, prénom, email et mot de passe sont obligatoires' });
    }
    const user = await User.create({ nom, prenom, email, password, telephone, role: role || 'client', statut: statut || 'actif' });
    await logAction({ action: 'CREATE_USER', entity: 'user', entityId: user.id, details: { email: user.email, role: user.role }, req });
    res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', data: user });
  } catch (error) {
    console.error('Erreur createUser:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    const { nom, prenom, email, telephone, role, statut, password } = req.body;
    if (nom !== undefined) user.nom = nom;
    if (prenom !== undefined) user.prenom = prenom;
    if (email !== undefined) user.email = email;
    if (telephone !== undefined) user.telephone = telephone;
    if (role !== undefined) user.role = role;
    if (statut !== undefined) user.statut = statut;
    if (password) user.password = password;
    await user.save();
    const updated = await User.findByPk(user.id, { attributes: { exclude: ['password'] } });
    await logAction({ action: 'UPDATE_USER', entity: 'user', entityId: user.id, details: { email: updated.email, role: updated.role, statut: updated.statut }, req });
    res.json({ success: true, message: 'Utilisateur mis à jour avec succès', data: updated });
  } catch (error) {
    console.error('Erreur updateUser:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    const userId = user.id;
    const userEmail = user.email;
    await user.destroy();
    await logAction({ action: 'DELETE_USER', entity: 'user', entityId: userId, details: { email: userEmail }, req });
    res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
};

// ===================== ROLES =====================

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['nom', 'ASC']],
      include: [{ model: Permission, as: 'permissions' }]
    });
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('Erreur getRoles:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des rôles', error: error.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, { include: [{ model: Permission, as: 'permissions' }] });
    if (!role) return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    res.json({ success: true, data: role });
  } catch (error) {
    console.error('Erreur getRoleById:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération du rôle', error: error.message });
  }
};

exports.createRole = async (req, res) => {
  try {
    const { nom, description, code } = req.body;
    if (!nom) return res.status(400).json({ success: false, message: 'Le nom du rôle est obligatoire' });
    const roleCode = code || nom.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const role = await Role.create({ nom, code: roleCode, description });
    await logAction({ action: 'CREATE_ROLE', entity: 'role', entityId: role.id, details: { nom: role.nom, code: role.code }, req });
    res.status(201).json({ success: true, message: 'Rôle créé avec succès', data: role });
  } catch (error) {
    console.error('Erreur createRole:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création du rôle', error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    const { nom, description, statut } = req.body;
    if (nom !== undefined) role.nom = nom;
    if (description !== undefined) role.description = description;
    if (statut !== undefined) role.statut = statut;
    await role.save();
    await logAction({ action: 'UPDATE_ROLE', entity: 'role', entityId: role.id, details: { nom: role.nom, statut: role.statut }, req });
    res.json({ success: true, message: 'Rôle mis à jour avec succès', data: role });
  } catch (error) {
    console.error('Erreur updateRole:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du rôle', error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    const roleId = role.id;
    const roleNom = role.nom;
    await role.destroy();
    await logAction({ action: 'DELETE_ROLE', entity: 'role', entityId: roleId, details: { nom: roleNom }, req });
    res.json({ success: true, message: 'Rôle supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteRole:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du rôle', error: error.message });
  }
};

// ===================== PERMISSIONS =====================

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({ order: [['nom', 'ASC']] });
    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('Erreur getPermissions:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des permissions', error: error.message });
  }
};

exports.createPermission = async (req, res) => {
  try {
    const { nom, code, description } = req.body;
    if (!nom || !code) return res.status(400).json({ success: false, message: 'Le nom et le code de la permission sont obligatoires' });
    const permission = await Permission.create({ nom, code, description });
    await logAction({ action: 'CREATE_PERMISSION', entity: 'permission', entityId: permission.id, details: { nom: permission.nom, code: permission.code }, req });
    res.status(201).json({ success: true, message: 'Permission créée avec succès', data: permission });
  } catch (error) {
    console.error('Erreur createPermission:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la permission', error: error.message });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ success: false, message: 'Permission non trouvée' });
    const { nom, code, description } = req.body;
    if (nom !== undefined) permission.nom = nom;
    if (code !== undefined) permission.code = code;
    if (description !== undefined) permission.description = description;
    await permission.save();
    await logAction({ action: 'UPDATE_PERMISSION', entity: 'permission', entityId: permission.id, details: { nom: permission.nom, code: permission.code }, req });
    res.json({ success: true, message: 'Permission mise à jour avec succès', data: permission });
  } catch (error) {
    console.error('Erreur updatePermission:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la permission', error: error.message });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission) return res.status(404).json({ success: false, message: 'Permission non trouvée' });
    const permissionId = permission.id;
    const permissionNom = permission.nom;
    await permission.destroy();
    await logAction({ action: 'DELETE_PERMISSION', entity: 'permission', entityId: permissionId, details: { nom: permissionNom }, req });
    res.json({ success: true, message: 'Permission supprimée avec succès' });
  } catch (error) {
    console.error('Erreur deletePermission:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de la permission', error: error.message });
  }
};

// ===================== ROLE PERMISSIONS =====================

exports.getRolePermissions = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id, { include: [{ model: Permission, as: 'permissions' }] });
    if (!role) return res.status(404).json({ success: false, message: 'Rôle non trouvé' });
    res.json({ success: true, data: role.permissions || [] });
  } catch (error) {
    console.error('Erreur getRolePermissions:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des permissions du rôle', error: error.message });
  }
};

exports.assignPermission = async (req, res) => {
  try {
    const { permissionId } = req.body;
    if (!permissionId) return res.status(400).json({ success: false, message: 'L\'identifiant de la permission est obligatoire' });
    await RolePermission.findOrCreate({ where: { roleId: req.params.id, permissionId } });
    const role = await Role.findByPk(req.params.id, { include: [{ model: Permission, as: 'permissions' }] });
    await logAction({ action: 'ASSIGN_PERMISSION', entity: 'role', entityId: role.id, details: { permissionId }, req });
    res.json({ success: true, message: 'Permission assignée avec succès', data: role });
  } catch (error) {
    console.error('Erreur assignPermission:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'assignation de la permission', error: error.message });
  }
};

exports.removePermission = async (req, res) => {
  try {
    const { permissionId } = req.body;
    if (!permissionId) return res.status(400).json({ success: false, message: 'L\'identifiant de la permission est obligatoire' });
    await RolePermission.destroy({ where: { roleId: req.params.id, permissionId } });
    const role = await Role.findByPk(req.params.id, { include: [{ model: Permission, as: 'permissions' }] });
    await logAction({ action: 'REMOVE_PERMISSION', entity: 'role', entityId: role.id, details: { permissionId }, req });
    res.json({ success: true, message: 'Permission retirée avec succès', data: role });
  } catch (error) {
    console.error('Erreur removePermission:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du retrait de la permission', error: error.message });
  }
};

// ===================== AUDIT LOGS =====================

exports.getAuditLogs = async (req, res) => {
  try {
    const { limit = 200 } = req.query;
    const logs = await AuditLog.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'nom', 'prenom', 'email'] }],
      order: [['dateCreation', 'DESC']],
      limit: Math.min(parseInt(limit, 10) || 200, 1000),
    });
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Erreur getAuditLogs:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des logs', error: error.message });
  }
};

