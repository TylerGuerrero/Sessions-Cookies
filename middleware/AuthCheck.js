const AuthCheck = (req, res, next) => {
    if (req.session.isAuth) {
        console.log(req.session)
        console.log(req.session.id)
        return next()
    } else {
        return res.redirect("/login")
    }
}

module.exports = {
    AuthCheck
}