const { default: mongoose } = require("mongoose");

// create a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    profilePicture: String
});

// create a model for user and export it.
module.exports = mongoose.model('User', userSchema, 'users');