const { Router } = require('express');
const AuditController = require('../controllers/AuditControllers.js');

const router = Router();
router.post('/newRegister', AuditController.register);


module.exports = router