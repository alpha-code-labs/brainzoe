const {verifyGoogleUser, registerByUserName, loginUser} = require('../controllers/auth.controller.js');
const express = require('express');

const router = express.Router();

router.post('/google-signin', verifyGoogleUser);
router.post('/register', registerByUserName);
router.post('/login', loginUser);


module.exports = router;