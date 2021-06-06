const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const session = require('express-session')
const dotenv = require('dotenv')
const path = require('path')
const MongoDBStore = require('connect-mongodb-session')(session)

const app = express()
dotenv.config()

const options = {   
                useNewUrlParser: true, 
                useCreateIndex: true, 
                useUnifiedTopology: true}

mongoose.connect(process.env.DB_CONNECT, options)
        .catch((err) => {console.log(err.message)})

mongoose.connection.on('error', () => {
    console.log('There is a error after MongoDB initial connection')
})

mongoose.connection.on('open', () => {
    console.log('MongoDB is runnning')
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const store = new MongoDBStore({
    uri: process.env.DB_CONNECT,
    collection: 'mySessions'
})

store.on('error', (error) => {
    console.log(error)
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store
}))

// app.get('/', (req, res) => {
//     req.session.isAuth = true
//     console.log(req.session)
//     console.log(req.session.id)
//     res.send('hi')
// })

app.get('/', (req, res) => {
    res.render('landing')
})

app.use(require('./routes/Route'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})