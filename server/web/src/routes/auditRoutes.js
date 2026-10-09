const { Router } = require('express');
const AuditController = require('../controllers/AuditControllers.js');
const auth = require('../service/AutenticaService');
const checkRole = require('../service/checkRole');

const router = Router();
router.post('/newRegister', AuditController.register);
router.get(
  '/register',
  auth.authenticatedUser,
  checkRole.checkRole([1, 2, 3]),
  AuditController.getRegisters,
);


module.exports = router