const userService = require('../services/user.service.js');
const { OAuth2Client } = require('google-auth-library');
const {ConflictError, NotFoundError, InvalidParameterError} = require('../utils/errors.js');
const bcrypt = require('bcrypt');

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
            //create user and jwt
            const user = await userService.registerUser({email, firstName, lastName, guid});
            const jwt = jwtProvider.generateToken(user._id);
            return res.status(201).json({message: 'User created successfully', jwt});
        }
    }catch(e){
        next(e);
    }
}

const registerByUserName = async(req, res, next)=>{
    try{
        const {userName, password} = req.body;

        //check if username already taken
        const existingUser = userService.findUserByUsername(userName);

        if(existingUser) throw new ConflictError(`Username already taken`);

        const user = await userService.registerByUserName(userName, password);
        const jwt = jwtProvider.generateToken(user._id);
        return res.status(201).json({message: 'User created successfully', jwt})

    }catch(e){
        next(e)
    }
}

const loginUser = async (req, res, next)=>{
    try{
        const  {userName, password}  = req.body;

        const user = await userService.findUserByUsername(userName);
        if(!user) throw new NotFoundError('User not found');

        //check if password is correct
        if(!bcrypt.compare(password, user.password)){
            throw new InvalidParameterError('Incorrect password');
        }

        const jwt = jwtProvider.generateToken(user._id);
        return res.status(200).json({message: 'Login successful', error: null, jwt});

    }catch(e){
        next(e);
    }
}

module.exports = {verifyGoogleUser, registerByUserName, loginUser}