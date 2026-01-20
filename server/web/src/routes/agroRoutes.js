const { Router } = require('express');
const AgroController = require('../controllers/AgroControllers.js');
var auth = require('../service/AutenticaService');
var checkRole = require('../service/checkRole');

const router = Router();
router.post('/registerAgro', AgroController.registerAgro);
router.get('/takecitys', AgroController.pegaCidades)
router.get('/takeregion', AgroController.pegaRegiao)
router.get('/umAgricultor/:id', AgroController.pegaFarmersId)
router.get('/farmerNoAnexo', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AgroController.farmersSemAnexo)
router.get('/checkcpf/:cpf', AgroController.consultarCPF)
router.get('/checkcadastro/:adagri', AgroController.consultarADAGRI)
router.get('/allFarmers', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.pegaFarmers)
router.put('/atualizaFarmer/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.atualizaFarmer)
router.delete('/farmer/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.deletaFarmer)


module.exports = router