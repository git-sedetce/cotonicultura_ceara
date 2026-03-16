const { Router } = require('express')
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const AnexoController = require('../controllers/AnexoControllers')
var auth = require('../service/AutenticaService');
var checkRole = require('../service/checkRole');

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

const upload = multer({ storage})

const router = Router()

router.post('/termoDoacao/:id', upload.single('file'), auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.anexoTermoDoacao)
router.post('/termoCompromisso/:id', upload.single('file'), auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.anexoTermoCompromisso)
router.post('/anexoResidencia/:id', upload.single('file'), AnexoController.anexoResidencia)
router.post('/anexoCPFCNPJ/:id', upload.single('file'), AnexoController.anexoCPFCNPJ)
router.post('/anexoPropriedade/:id', upload.single('file'), auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.anexoPropriedade)
router.put('/updateFile/:id', upload.single('file'), auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.atualizarAnexo)

router.get('/anexo', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.pegaAnexo)
router.get('/anexoByTipo/:tipo', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.pegaAnexoByType)
router.get('/anexoFarm/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.pegaAnexoByFarmId)
router.get('/checkAnexoById/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.checkFileById)
router.get('/getFile/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.pegarArquivoById)

router.delete('/deleteAnexo/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]),AnexoController.deletarAnexo)

module.exports = router