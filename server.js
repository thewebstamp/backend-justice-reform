require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const allowedOrigins = [
  'https://justice-reform-arkansas.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server or curl (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Email transporter setup
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.NOTIFY_EMAIL,
    pass: process.env.NOTIFY_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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

// Donation form
app.post('/api/donate', async (req, res) => {
  const { name, contact, message } = req.body;

  if (!name || !contact || !message) {
    return res.status(400).json({ message: 'Please fill in all fields.' });
  }

  const mailOptions = {
    from: `"Justice Reform Contact Form" <${process.env.NOTIFY_EMAIL}>`,
    to: process.env.NOTIFY_SEMAIL,
    subject: 'New Donation/Assistance Offer',
    html: `
      <h2>Donation Assistance Form</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email or Phone:</strong> ${contact}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Donation form submitted successfully.' });
  } catch (err) {
    console.error('Donation form error:', err.message);
    res.status(500).json({ message: 'Email could not be sent. Try again later.' });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
