const {verifyGoogleUser, registerByUserName} = require('../controllers/auth.controller.js');
const express = require('express');

const router = express.Router();

router.post('/google-signin', verifyGoogleUser);
router.post('/register', registerByUserName);


module.exports = router;