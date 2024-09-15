const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyOtp } = require('../controllers/authController');

// OTP routes
router.post('/generate', authController.generateOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
