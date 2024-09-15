
require('dotenv').config();
const argon2 = require('argon2');
const User = require('../models/User');

const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../config/mail');
const config = require('../config/db'); // Assuming you have some configuration for OTP expiry

// Controller for user signup
// const User = require('../models/User');
// const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
// const crypto = require('crypto');
// const { sendMail } = require('../config/mail');
require('dotenv').config(); // Make sure to import dotenv to use environment variables

// Controller for user signup
// const argon2 = require('argon2');
// const User = require('./models/User'); // Adjust the path as needed
// const sendMail = require('./utils/sendMail'); // Adjust the path as needed

// Controller for user signup
// Controller for user signup
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, contactMode } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    // Hash the password
    const trimmedPassword = password.trim();
    const hashedPassword = await argon2.hash(trimmedPassword);
    console.log('Hashed password for new user:', hashedPassword);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contactMode
    });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);

    // Set OTP and expiration time
    newUser.otp = otp;
    newUser.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    // Save the user to the database
    await newUser.save();

    // Send the OTP via email
    const subject = 'Your OTP Code';
    const text = `Your OTP code is ${otp}`;
    await sendMail(email, subject, text);
    console.log('OTP sent to:', email);

    res.status(201).json({ success: true, message: 'User registered successfully. Please check your email for the OTP.' });

  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};

// Controller for user login
// Controller for user login
exports.login = async (req, res) => {
  try {
    console.log('Incoming login request body:', req.body);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Validation failed: Missing email or password');
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find the user
    const user = await User.findOne({ email });
    console.log('User found:', user);
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ success: false, message: 'User not found.' });
    }

    // Compare the password
    const isPasswordMatch = await argon2.verify(user.password, password);
    console.log('Password match result:', isPasswordMatch);

    if (!isPasswordMatch) {
      console.log('Incorrect password for email:', email);
      return res.status(400).json({ success: false, message: 'Incorrect password.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, // Use a secret from your environment variables
      { expiresIn: '1h' } // Token expiration time
    );

    // Successful login
    res.status(200).json({ success: true, message: 'Login successful.', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
};


// Controller for generating and sending OTP
exports.generateOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = crypto.randomInt(100000, 999999).toString();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Save OTP and expiry time (e.g., 5 minutes)
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ success: false, message: 'Error sending OTP' });
      }
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Controller for verifying OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  console.log('Received OTP:', otp); // Log received OTP

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    console.log('User from DB:', user); // Log user data from DB

    // Check if OTP matches and is not expired
    if (user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Clear OTP fields after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
