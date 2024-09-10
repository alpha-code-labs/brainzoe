const express = require('express');
const {getUserProfile, updateUserCoins} = require('../controllers/user.controller.js');
const { authenticate } = require('../middlewares/authenticate.middleware.js');
const router = express.Router();

router.get('/profile', authenticate, getUserProfile);
router.patch('/coins', authenticate, updateUserCoins);


module.exports = router;