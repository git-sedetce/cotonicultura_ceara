const { Router } = require('express');
const AgroController = require('../controllers/AgroControllers.js');
var auth = require('../service/AutenticaService');
var checkRole = require('../service/checkRole');
const multer = require('multer')
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        const pastaUploads = path.join(__dirname, '../uploads/anexos');
        verificarECriarPasta(pastaUploads);
        cb(null, pastaUploads)
    },
    filename: function(req, file, cb){
        cb(null,  Date.now() + '_sde_' + 'cotonicultura_' + file.originalname)
  }
})

// Função para verificar se a pasta existe e criar se não existir
function verificarECriarPasta(pastaPath) {
    if (!fs.existsSync(pastaPath)) {
        fs.mkdirSync(pastaPath, { recursive: true });
        console.log(`A pasta ${pastaPath} foi criada.`);
    } else {
        console.log(`A pasta ${pastaPath} já existe.`);
    }
  }

const upload = multer({ storage});

const router = Router();
router.post('/registerAgro', AgroController.registerAgro);
router.post("/registerCompleto", upload.fields([
    { name: "cpf", maxCount: 1 },
    { name: "residencia", maxCount: 1 },
  ]),
  AgroController.registerAgroCompleto
);
router.get('/takecitys', AgroController.pegaCidades)
router.get('/takeregion', AgroController.pegaRegiao)
router.get('/umAgricultor/:id', AgroController.pegaFarmersId)
router.get('/takeCity/:city', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AgroController.pegaCidade)
router.get('/agricultorByCity/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AgroController.pegaFarmersCity)
router.get('/farmerNoAnexo', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AgroController.farmersSemAnexo)
router.get('/checkcpf/:cpf', AgroController.consultarCPF)
router.get('/checkcadastro/:adagri', AgroController.consultarADAGRI)
router.get('/allFarmers', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.pegaFarmers)
router.put('/atualizaFarmer/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.atualizaFarmer)
router.patch('/desistir/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.desisitirPrograma)
router.delete('/farmer/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.deletaFarmer)


module.exports = router