const { Schema, model } = require('mongoose')

const UserSchema = Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    resetToken: {
        type: String
    }
})


module.exports = model('User', UserSchema)