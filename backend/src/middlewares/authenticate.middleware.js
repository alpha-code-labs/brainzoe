const jwtProvider = require('../config/jwtProvider.js');
const userService = require('../services/user.service.js');

const {AuthenticationError} = require('../utils/errors.js');

const authenticate = async (err, req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];

        if(!token) throw new AuthenticationError('Token not provided');

        const userId = jwtProvider.getUserIdFromToken(token);
        const user = await userService.findUserById(userId);

        if(!userId) throw new AuthenticationError('Invalid token');

        req.user = user;
        next();

    }catch(e){
        next(e);
    }
}


module.exports  = {authenticate};