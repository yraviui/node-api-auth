const { hashPassword, comparePassword } = require("../helpers/authHelper")
const UserModel = require("../models/userModel")
const JWT = require('jsonwebtoken')

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body

    // fields validation
    if(!name){ return res.send({ message: 'Name field is required!'}) }
    if(!email){ return res.send({ message: 'email field is required!'}) }
    if(!password){ return res.send({ message: 'password field is required!'}) }
    if(!phone){ return res.send({ message: 'phone field is required!'}) }
    if(!address){ return res.send({ message: 'address field is required!'}) }
    if(!answer){ return res.send({ message: 'answer field is required!'}) }
    
    // check user
    const existingUser = await UserModel.findOne({ email })
    
    // existing user
    if(existingUser){
        return res.status(200).send({
            success: false,
            message: 'Already user is regissered. Please login!'
        })
    }

     // for password hashing
     const hashedPassword = await hashPassword(password)

     // save
     const user = await UserModel({ name, email, password: hashedPassword, phone, address, answer }).save()

    res.status(200).send({
        success: true,
        message: 'User register succefull!',
        user
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({
        success: false,
        messsage: 'Error while register user',
        error
    })
  }
}

const loginController = async (req, res) => {
    try {
      const { email, password } = req.body
      // validation
      if(!email || !password){
        return res.status(404).send({
          success: false,
          message: 'Invalid email or password!'
        })
      }
      // check user
      const user = await UserModel.findOne({ email })

      if(!user){
        return res.status(404).send({
          success: false, message: 'Email is not registered!'
        })
      }

      // match user
      const matchUesr = await comparePassword(password, user.password)

      if(!matchUesr){
        return res.status(200).send({
          success: false, message: 'Invalid Password'
        })
      }

      // token
      const token = await JWT.sign({ _id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
      })

      res.status(200).send({
        success: true,
        message: 'Login Successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role
        },
        token
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: false,
        message: 'Error while login',
        error
      })
    }
 }

 const forgotPasswordController = async (req, res) => {
    try {
      const { email, answer, newPassword } = req.body

      // validation
      if( !email ){ return res.send({ message: 'email field is required!' })}
      if( !answer ){ return res.send({ message: 'answer field is required!' })}
      if( !newPassword ){ return res.send({ message: 'newPassword field is required!' })}

      // check user
      const user = await UserModel.findOne({ email, answer })

      // validate
      if(!user){
        return res.status(404).send({
          success: false, message: 'Wrong email or Answer for reset password'
        })
      }

      // hash new password
      const hashed = await hashPassword(newPassword)

      // update new password
      await UserModel.findByIdAndUpdate(user._id, { password: hashed })

      res.status(200).send({
        success: true,
        message: 'Password reset successfully completed'
      })
    } catch (error) {
      console.log(error)
      res.status(400).send({
        success: false,
        message: 'Error while forgot password to reset',
        error
      })
    }
 }


module.exports = { registerController, loginController, forgotPasswordController }