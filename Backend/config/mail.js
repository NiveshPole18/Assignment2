const nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure this is present if you use environment variables

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or use another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
