const { Router } = require('express');
const AgroController = require('../controllers/AgroControllers.js');

const router = Router();
router.post('/registerAgro', AgroController.registerAgro);
router.get('/takecitys', AgroController.pegaCidades)
router.get('/checkcpf/:cpf', AgroController.consultarCPF)
router.get('/checkcadastro/:adagri', AgroController.consultarADAGRI)


module.exports = router