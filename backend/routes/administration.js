const express = require('express');
const router = express.Router();
const adminController = require('../controllers/administrationController');

// Utilisateurs
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Rôles
router.get('/roles', adminController.getRoles);
router.get('/roles/:id', adminController.getRoleById);
router.post('/roles', adminController.createRole);
router.put('/roles/:id', adminController.updateRole);
router.delete('/roles/:id', adminController.deleteRole);

// Permissions
router.get('/permissions', adminController.getPermissions);
router.post('/permissions', adminController.createPermission);
router.put('/permissions/:id', adminController.updatePermission);
router.delete('/permissions/:id', adminController.deletePermission);

// Rôles <-> Permissions
router.get('/roles/:id/permissions', adminController.getRolePermissions);
router.post('/roles/:id/permissions', adminController.assignPermission);
router.delete('/roles/:id/permissions', adminController.removePermission);

module.exports = router;
