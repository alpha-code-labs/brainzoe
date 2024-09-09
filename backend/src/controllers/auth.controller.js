const userService = require('../services/user.service.js');
const { OAuth2Client } = require('google-auth-library');

const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

const jwtProvider = require('../config/jwtProvider.js');

const verifyGoogleUser = async(req, res, next)=>{
    try{
        const token = req.body.idToken
        console.log(token, 'token from google signin in request');
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: clientId,
        });
        const payload = ticket.getPayload();
        console.log(payload, 'payload after processing...');
        //get user info
        const email = payload.email;
        const firstName = payload.given_name;
        const lastName = payload.family_name;
        const guid = payload.sub;
        const verifiedEmail = payload.email_verified;

        const user_ = await userService.getUserByGoogleId(guid);

        if (user_) {
            const jwt = jwtProvider.generateToken(user_._id);
            return res.status(200).json({success: true, jwt});
        }else{
            //create and return new user
            const user = await userService.registerUser({email, firstName, lastName, guid});
            const jwt = jwtProvider.generateToken(user._id);
            return res.status(200).json({success: true, jwt});
        }
    }catch(e){
        next(e);
    }
}


module.exports = {verifyGoogleUser}