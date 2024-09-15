const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // For authentication routes
const otpRoutes = require('./routes/otpRoutes');   // For OTP routes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hero', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Separate routes for auth and OTP, avoid conflict
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
