const express = require('express');
const {getUserProfile, updateUserCoins, getUserCoins} = require('../controllers/user.controller.js');
const { authenticate } = require('../middlewares/authenticate.middleware.js');
const router = express.Router();

router.get('/', (req, res)=> res.send(200).json('This is user route'));
router.get('/profile', authenticate, getUserProfile);
router.get('/coins', authenticate, getUserCoins);
router.patch('/coins', authenticate, updateUserCoins);


module.exports = router;