const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')

const {register, login, changeUserPassword, loggedUser, sendPasswordResetEmail, resetPassword} = require('../controllers/userController')
const router = express.Router()

router.post('/register',register)
router.post('/login',login)

router.post('/set-password-reset-email',sendPasswordResetEmail)
router.post('/reset-password/:id/:token',resetPassword)
router.post('/change-user-password',authMiddleware, changeUserPassword)

router.get('/loggedUser', authMiddleware, loggedUser)

module.exports = router