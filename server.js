require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('Nodemailer verification failed:', error);
  } else {
    console.log('✅ Ready to send emails');
  }
});

// Stay Informed subscription route
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const mailOptions = {
    from: `Justice Reform for Arkansas <${process.env.NOTIFY_EMAIL}>`,
    to: process.env.NOTIFY_SEMAIL,
    subject: 'New Email Subscription',
    text: `A new person subscribed to get updates about exposing the Corrupt Justice System of Craighead County with this email:\n\n${email}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Thank you for subscribing.' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send email.' });
  }
});

// Protest Sign-Up route
app.post('/api/protest-signup', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  const mailOptions = {
    from: `Justice Reform for Arkansas <${process.env.NOTIFY_EMAIL}>`,
    to: process.env.NOTIFY_SEMAIL,
    subject: 'New Protest Sign-Up',
    text: `🚨 Someone just signed up for the protest.\n\nName: ${name}\nEmail: ${email}\n\nLet’s be ready to organize.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Thank you for signing up. We’ll see you on August 2nd!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Failed to send confirmation email.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
