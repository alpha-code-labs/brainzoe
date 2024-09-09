const User = require('../models/user.model.js');
const {InvalidParameterError, NotFoundError} = require('../utils/errors.js');

const registerUser = async ({firstName, lastName, email, guid})=>{
    try{
        if(!firstName, !lastName, !email, !guid){
            throw new InvalidParameterError('Missing required fields');
        }

        const user = await User.create({firstName, lastName, email, googleId:guid, coins:0});
        return user;
        
    }catch(e){
        throw e;
    }
}

const findUserById = async (userId)=>{
    return await User.findById(userId);
}

const getUserByGoogleId = async (guid)=>{
    return await User.findOne({googleId: guid});
}
   


module.exports = {registerUser, findUserById, getUserByGoogleId}