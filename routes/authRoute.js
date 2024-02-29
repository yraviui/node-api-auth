const express = require('express')
const { registerController, loginController, forgotPasswordController } = require('../controllers/authController')
const { requireSignIn, isAdmin } = require('../middlerwares/authMiddlewares')


// router object
const router = express.Router()

// routing
// REGISTER || HTTP Method: post
router.post('/register', registerController)

// Login || HTTP Method: post
router.post('/login', loginController)

// Forgot password || POST
router.post('/forgot-password', forgotPasswordController)

// protect route auth for User
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ ok: true})
})

// protect for isAdime
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true })
} )

module.exports = router