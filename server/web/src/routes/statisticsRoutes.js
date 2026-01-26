const { Router } = require('express')
const StatisticsController = require('../controllers/StatisticsController')
var auth = require('../service/AutenticaService');
var checkRole = require('../service/checkRole');

const router = Router()
router.get('/totalAgricultores', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.countProdutores);
router.get('/countPorMunicipio', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.countPorMunicipio);
router.get('/countPorRegiao', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.countPorRegiao);
router.get('/countAtendidos', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.countAgricultoresAtendidos);
router.get('/totalSementesDistribuidas', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.totalSementesDistribuidas);
router.get('/sementesPorRegiao', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.sementesPorRegiao);
router.get('/sementesPorMunicipio', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.sementesPorMunicipio);
router.get('/countPorTipoCultivo', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.countPorTipoCultivo);
router.get('/hectareMunicipio', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.sumAreaCultivo);
router.get('/hectareRegiao', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), StatisticsController.sumAreaCultivoRegiao);


module.exports = router