const { Router } = require('express')
const UserController = require('../controllers/UserControllers')


const router = Router()
router.post('/register', UserController.cadastraUser)
router.post('/login', UserController.login)
router.get('/user', UserController.authenticatedUser)
router.get('/allUser', UserController.pegaUsers)
// router.get('/userByProfile/: id', UserController.usersProfile)
router.put('/atualizaUser/:id', UserController.atualizaUser)
router.post('/logout', UserController.logout)
router.post('/reset', UserController.resetPassword)
router.get('/getUser/:id', UserController.pegarUser)
router.get('/getUserSexec/:id', UserController.pegarUserSexec)
router.delete('/user/:id', UserController.deletaUsers)

module.exports = router