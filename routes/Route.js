const router = require('express').Router()
const { genSalt, hash, compare } = require('bcryptjs')

const User = require('../models/User')
const { AuthCheck } = require('../middleware/AuthCheck')

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({email})

        if (!user) return res.status(201).json({err: 'user does not exist'})

        const isMatch = await compare(password, user.password)

        if (isMatch) {
            req.session.isAuth = true
            return res.status(201).redirect("/dashboard")
        } else {
            return res.status(201).redirect("/login")
        }
    } catch(err) {
        return res.status(500).json({err: err.message})
    }
})

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    try {
        let user =  await User.findOne({email})
        
        if (user) return res.status(201).redirect('/register')
        
        const salt = await genSalt(12)
        const hashedPassword = await hash(password, salt)
        await User.create({username, email, password: hashedPassword})
        return res.redirect('/login')
    } catch (err) {
        return res.status(500).json({err: err.message})
    }   
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/dashboard', AuthCheck, (req, res) =>  {
    res.render('dashboard')
})

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err
        return res.redirect("/login")
    })
})

module.exports = router