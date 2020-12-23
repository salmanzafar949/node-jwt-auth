const User = require('../models/User')
const jwt = require('jsonwebtoken')
require('dotenv/config')

const handleErrors = (err) => {
    let errors = {email: "", password: ""}

    if (err.code === 11000){
        errors["email"] = "Email already taken"

        return errors;
    }

    if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })

        return errors;
    }
}
const maxAge = 3 * 24 * 60 * 60;

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.signup_post = async (req, res) => {

    const {email, password} = req.body;

    try{
        const user = await User.create({email, password});
        const token = generateToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }catch (e){
        const errors = handleErrors(e)

        res.status(422).json({errors})
    }
}
module.exports.login_post = (req, res) => {
    res.send('signup')
}