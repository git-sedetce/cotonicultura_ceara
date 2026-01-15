const { Router } = require('express');
const AgroController = require('../controllers/AgroControllers.js');

const router = Router();
router.post('/registerAgro', AgroController.registerAgro);
router.get('/takecitys', AgroController.pegaCidades)


module.exports = router