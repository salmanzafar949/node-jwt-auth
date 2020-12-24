const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    // check jwt exists * isVerified
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err){
                console.log(err.message)
                res.redirect('/login')
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                res.locals.user = await User.findById(decodedToken.id)
                next()
            }
        })
    }else{
        res.locals.user = null
        next()
    }
}

module.exports = {
    requireAuth,
    checkUser
};