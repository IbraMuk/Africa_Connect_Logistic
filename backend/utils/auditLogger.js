const { AuditLog } = require('../models');

async function logAction({ userId, action, entity, entityId, details, req }) {
  try {
    let ip = null;
    if (req) {
      ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip || null;
    }
    await AuditLog.create({
      userId: userId || null,
      action,
      entity: entity || null,
      entityId: entityId ? String(entityId) : null,
      details: details ? JSON.stringify(details) : null,
      ipAddress: ip,
    });
  } catch (error) {
    console.error('Erreur audit log:', error.message);
  }
}

module.exports = { logAction };
