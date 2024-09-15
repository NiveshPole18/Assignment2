const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {login}=require('../controllers/authController')
// const otpController = require('../controllers/otpController');

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// // OTP routes
// router.post('/generate-otp', authController.generateOtp); // Route for generating and sending OTP
// router.post('/verify-otp', authController.verifyOtp); // Route for verifying OTP

module.exports = router;
