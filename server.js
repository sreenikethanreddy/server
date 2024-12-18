const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Added CORS support
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(cors({
  origin: 'https://sreenikethanreddy.github.io/portfolio/', // Replace with your portfolio's actual domain
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root endpoint for testing the server
app.get('/', (req, res) => {
  res.send('Server is running! Use POST /contact to send messages.');
});

// API endpoint for form submission
app.post('/contact', (req, res) => {
  const { fullname, email, message } = req.body;

  // Email transport setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Email from .env file
      pass: process.env.EMAIL_PASS, // Password from .env file
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: process.env.EMAIL_USER,   // Recipient's email
    subject: 'New Contact Form Submission',
    text: `Name: ${fullname}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email Error:', err.message);
      return res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
    res.json({ success: true, message: 'Message Sent Successfully!' });
  });
});

// Start the server
const PORT = process.env.PORT || 3000; // Use dynamic port for Render
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
