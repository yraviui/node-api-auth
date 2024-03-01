const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const { connectDB } = require('./config/db')
const authRoute = require('./routes/authRoute')
const categogryRoutes = require('./routes/categogryRoutes')

// env config
dotenv.config()

// db connection
connectDB()

// set port
const PORT = process.env.PORT || 5000

// app setting
const app = express()

// body parser
app.use(express.json())

/* ------------ API  ------------*/
app.get('/api', (req, res) =>{ res.send({ message: 'API Testing'}) })

// routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categogryRoutes)
/* ------------ API  //----------*/

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.bgGreen))


