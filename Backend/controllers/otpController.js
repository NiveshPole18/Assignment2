const User = require('../models/User'); // Adjust path as necessary
const Otp = require('../models/Otp'); // Adjust path as necessary

// Verify OTP
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
