const userService = require('../services/user.service.js');

const getUserProfile = async (req, res, next)=>{
    try{
        const user = req.user;
        return res.status(200).json({user, error:null});
        
    }catch(e){
        next(e);
    }
}

const updateUserCoins = async (req, res, next)=>{
    try{
        const {conins} = req.body;
        await userService.updateUserCoins(conins);

        return res.status(200).json({message:'user coins updated', error:null, success:true});
    }catch(e){
        next(e);
    }
}

module.exports = {getUserProfile, updateUserCoins}
