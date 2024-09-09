const {verifyGoogleUser} = require('../controllers/auth.controller.js');
const express = require('express');

const router = express.Router();

router.post('/google-signin', verifyGoogleUser);


module.exports = router;