const express = require('express');
const { loginUser, verifyOtp } = require('../utils/userAuthController');

const router = express.Router();

// Unified login route with logger
router.post('/login',  loginUser);

// OTP Verification Route with logger
router.post('/verify-otp',  verifyOtp);


module.exports = router;
