// Step 0: Set up the necessary imports and initial configurations:
require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const pool = require('./db');  // Assuming you've a 'db.js' for database operations

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Step 1: Setup a mailer using Google OAuth
// Setup nodemailer transporter

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  }
});


// A function to send emails
async function sendVerificationEmail(toEmail, code) {
  try {
    await transporter.sendMail({
      from: 'YOUR_GMAIL_ADDRESS',
      to: toEmail,
      subject: 'Verification Code for MoneyMatters',
      text: `Your verification code is: ${code}`
    });
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

// Step 2: Implement the user account creation process
// Create the endpoint to handle user registration:
const verificationCodes = {};  // Temporary storage for verification codes

app.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate if any field is empty
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // TODO: Check for existing username here

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000);
    verificationCodes[email] = code;

    // Send the verification email
    await sendVerificationEmail(email, code);

    res.json({ message: 'Verification code sent to email. Please verify to complete registration.' });

  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create an endpoint to handle the verification code submission:
app.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (verificationCodes[email] === Number(code)) {
      // TODO: Store user details in the database here after hashing the password

      // Clear the verification code
      delete verificationCodes[email];
      res.json({ message: 'Account created successfully!' });
      console.log(`User with email ${email} was successfully created!`);
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }

  } catch (error) {
    console.error('Error in verification:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to Get all Users for testing purposes
app.get("/users", async (req, res) => {
  try {
      const allUsers = await pool.query("SELECT * FROM users");
      res.json(allUsers.rows);
  } catch (err) {
      console.error(err.message);
  }
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});
