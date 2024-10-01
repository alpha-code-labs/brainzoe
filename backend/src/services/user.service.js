const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');

const registerUser = async ({firstName, lastName, email, guid})=>{
        const user = await User.create({firstName, lastName, email, googleId:guid, coins:0});
        return user;
}

const findUserById = async (userId)=>{
    return await User.findById(userId);
}

const getUserByGoogleId = async (guid)=>{
    return await User.findOne({googleId: guid});
}

const findUserByUsername = async (userName)=>{
    return await User.findOne({userName});
}

const registerByUserName =  async(userName, password)=>{
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create({userName, password:hashedPassword, coins:0});
    return user;
}

const updateUserCoins = async (userId, coins)=>{
    const user = findUserById(userId);
    user.coins += coins;
    return await user.save();
    //return await User.findOneAndUpdate({_id:userId}, {$set: {coins}}, {new:true})
}

const getUserCoins = async (userId)=>{
    return await User.findOne({_id:userId}, {coins:1});
}
   


module.exports = {registerUser, registerByUserName, findUserById, findUserByUsername, getUserByGoogleId, updateUserCoins, getUserCoins}