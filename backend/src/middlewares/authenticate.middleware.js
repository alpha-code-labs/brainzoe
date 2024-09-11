const jwtProvider = require('../config/jwtProvider.js');
const userService = require('../services/user.service.js');

const {AuthenticationError} = require('../utils/errors.js');

const authenticate = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        console.log('token..', token)

        if(!token) throw new AuthenticationError('Token not provided');
        if(!isJwt(token)) throw new AuthenticationError('Malformed jwt');

        const userId = jwtProvider.getUserIdFromToken(token);
        const user = await userService.findUserById(userId);

        if(!userId) throw new AuthenticationError('Invalid token');

        req.user = user;
        next();

    }catch(e){
        next(e);
    }
}


const isJwt = (token) => {
    if (!token) return false;
  
    const parts = token.split('.');
    if (parts.length !== 3) return false;
  
    try {
      // Validate Base64 or Base64URL encoding
      const [header, payload] = parts;
      const base64UrlPattern = /^[A-Za-z0-9-_]+$/; // Base64URL characters
      return base64UrlPattern.test(header) && base64UrlPattern.test(payload);
    } catch (e) {
      return false;
    }
  };

module.exports  = {authenticate};