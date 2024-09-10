const User = require('../models/user.model.js');
const {InvalidParameterError, NotFoundError, ConflicError} = require('../utils/errors.js');

const registerUser = async ({firstName, lastName, email, guid})=>{
        if(!firstName, !lastName, !email, !guid){
            throw new InvalidParameterError('Missing required fields');
        }

        const user = await User.create({firstName, lastName, email, googleId:guid, coins:0});
        return user;
}

const findUserById = async (userId)=>{
    return await User.findById(userId);
}

const getUserByGoogleId = async (guid)=>{
    return await User.findOne({googleId: guid});
}

const findUserByUsername = async (userId)=>{
    return await User.findOne({userName});
}

const registerByUserName =  async(userName)=>{
    if(!userName) throw new InvalidParameterError('Username is required');
    const user = await User.create({userName, coins:0});
    return user;
}

const updateUserCoins = async (userId, coins)=>{
    try{
        const res = await User.findOneAndUpdate({userId}, {coins})
        if(res) return {success: true}
    }catch(e){
        return {success: false}
    }
}
   


module.exports = {registerUser, registerByUserName, findUserById, findUserByUsername, getUserByGoogleId, updateUserCoins}