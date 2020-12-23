const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Invalid email']
    },
    password:{
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password should be minimum 6 characters long"]
    }
})

// fire a function before user doc is saved to db
userSchema.pre('save', async function (next){
    // console.log('user is about to be created and saved', this)
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()

})

// fire a function after user doc is saved to db
/*userSchema.post('save', (doc, next) => {
    console.log('user was created and saved')
    next()
})*/


const User = mongoose.model('user', userSchema)

module.exports = User;