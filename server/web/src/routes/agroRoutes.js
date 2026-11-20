const { Router } = require('express');
const AgroController = require('../controllers/AgroControllers.js');
var auth = require('../service/AutenticaService');
var checkRole = require('../service/checkRole');
const multer = require('multer')
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('node:crypto');

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

const uploadPerfilStorage = multer.diskStorage({
    destination: function(req, file, cb){
        const pastaUploads = path.join(__dirname, '../uploads/anexos');
        verificarECriarPasta(pastaUploads);
        cb(null, pastaUploads)
    },
    filename: function(req, file, cb){
        const extensoes = {
            'application/pdf': '.pdf',
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
        };
        cb(null, `${randomUUID()}${extensoes[file.mimetype] || ''}`);
    }
});

const uploadPerfil = multer({
    storage: uploadPerfilStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!tiposPermitidos.includes(file.mimetype)) {
            return cb(new Error('Envie um arquivo PDF, JPG, JPEG ou PNG'));
        }
        cb(null, true);
    }
});

function receberAnexoPerfil(req, res, next) {
    uploadPerfil.single('file')(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ message: 'O arquivo deve ter no máximo 10 MB' });
        }
        return res.status(400).json({ message: error.message });
    });
}

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
router.get('/takeCity/:city', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]),AgroController.pegaCidade)
router.get('/agricultorByCity/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]),AgroController.pegaFarmersCity)
router.get('/farmerNoAnexo', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]),AgroController.farmersSemAnexo)
router.get('/checkcpf/:cpf', AgroController.consultarCPF)
router.get('/checkcadastro/:adagri', AgroController.consultarADAGRI)
router.get('/allFarmers', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]), AgroController.pegaFarmers)
router.put('/atualizaFarmer/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]), AgroController.atualizaFarmer)
router.post('/adicionaDistribuicoes/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]), AgroController.adicionaDistribuicoes)
router.patch('/atualizaAtendimentoDistribuicoes/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]), AgroController.atualizaAtendimentoDistribuicoes)
router.patch('/desistir/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4,5]), AgroController.desisitirPrograma)
router.delete('/farmer/:id', auth.authenticatedUser, checkRole.checkRole([1,2,3,4]), AgroController.deletaFarmer)
router.get('/perfilProdutor', auth.authenticatedUser, checkRole.checkProducer, AgroController.pegaPerfilProdutor)
router.put('/perfilProdutor', auth.authenticatedUser, checkRole.checkProducer, AgroController.atualizaPerfilProdutor)
router.post('/perfilProdutor/pedidos', auth.authenticatedUser, checkRole.checkProducer, AgroController.criaPedidoProdutor)
router.put('/perfilProdutor/anexos/:tipo', auth.authenticatedUser, checkRole.checkProducer, receberAnexoPerfil, AgroController.atualizaAnexoProdutor)
router.get('/perfilProdutor/anexos/:tipo', auth.authenticatedUser, checkRole.checkProducer, AgroController.pegaAnexoProdutor)


module.exports = router