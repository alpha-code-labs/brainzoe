const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    userName: {type: String, required:true},
    password: {type: String, required: true},
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    googleId: {type: String},
    coins: {type: Number, required:true, default: 0}
});

const User = mongoose.model('user', userSchema);

module.exports = User;