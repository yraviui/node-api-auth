const JWT = require('jsonwebtoken')
const UserModel = require('../models/userModel')

// Protect Routes token base
const requireSignIn = async (req, res, next) => {
    try {
        const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        console.log(error)
    }
}

// admin access
const isAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(404).send({
                success: false, message: 'Unauthorized Access'
            })
        }else{
            next()
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: 'Error in admin middleware',
            error
        })
    }
}

module.exports = { requireSignIn, isAdmin }