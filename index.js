const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieSession = require('express-session')
const dotenv = require('dotenv')

const app = express()
dotenv.config()

const options = {   
                useNewUrlParser: true, 
                useCreateIndex: true, 
                useFindAndModify: true, 
                useUnifiedTopology: true}

mongoose.connect(process.env.DB_CONNECT, options)
        .catch((err) => {console.log(err.message)})

mongoose.connection.on('error', () => {
    console.log('There is a error after MongoDB initial connection')
})

mongoose.connection.on('open', () => {
    console.log('MongoDB is runnning')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(cookieSession({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
}))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})