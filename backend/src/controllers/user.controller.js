const userService = require('../services/user.service.js');
const { InvalidParameterError } = require('../utils/errors.js');

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
        const {coins} = req.body;
        const user = req.user;
        console.log(coins, 'coins...')
        if(!coins) throw new InvalidParameterError('Missing required filed [coins]');
        const parsedCoins = parseInt(coins);
        if(parseInt(parsedCoins) == NaN) throw new InvalidParameterError('coins must parse to a valid number');
        if(parseInt(parsedCoins) < 0) throw new InvalidParameterError('coins can not be negative');

        const result = await userService.updateUserCoins(user._id, parsedCoins);
        console.log(result, 'res...')
        if(result){
            return res.status(200).json({message:'user coins updated', error:null, success:true, updatedCoins: result.coins});
        } 
            
    }catch(e){
        next(e);
    }
}

const getUserCoins = async (req, res, next)=>{
    try{
        const user = req.user;
        const result = await userService.getUserCoins(user._id);
        if(result) return res.status(200).json({error:null, success:true, message:'User coins fetched', coins: result.coins});


    }catch(e){
        next(e);
    }
}

module.exports = {getUserProfile, updateUserCoins, getUserCoins}
