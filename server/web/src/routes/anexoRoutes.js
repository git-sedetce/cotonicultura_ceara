const { Router } = require('express')
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const AnexoController = require('../controllers/AnexoControllers')

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

router.post('/anexoIdentidade/:id', upload.single('file'), AnexoController.anexoIdentidade)
router.post('/anexoResidencia/:id', upload.single('file'), AnexoController.anexoResidencia)
router.post('/anexoCPFCNPJ/:id', upload.single('file'), AnexoController.anexoCPFCNPJ)
router.post('/anexoPropriedade/:id', upload.single('file'), AnexoController.anexoPropriedade)
router.put('/updateFile/:id', upload.single('file'), AnexoController.atualizarAnexo)

router.get('/anexo', AnexoController.pegaAnexo)
router.get('/anexoByTipo/:tipo', AnexoController.pegaAnexoByType)
router.get('/anexoFarm/:id', AnexoController.pegaAnexoByFarmId)
router.get('/checkAnexoById/:id', AnexoController.checkFileById)
router.get('/getFile/:id', AnexoController.pegarArquivoById)

router.delete('/deleteAnexo/:id', AnexoController.deletarAnexo)

module.exports = router