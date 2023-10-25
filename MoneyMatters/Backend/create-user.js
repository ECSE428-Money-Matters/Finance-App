// Step 0: Set up the necessary imports and initial configurations:
require('dotenv').config();

const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const router = express.Router();

// Uncomment when ready to use hashedPassword
// const bcrypt = require('bcrypt');

// Middleware
router.use(cors());
router.use(express.json());

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
      from: 'noreply.moneymatters@gmail.com',
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
const verificationData = {};  // Temporary storage for verification codes and password

router.post('/register', async (req, res) => {
  console.log("IN REGISTER");
  try {
    const { email, username, password } = req.body;

    // Validate if any field is empty
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // TODO: Check for existing user here
    // Check for existing email
    const emailExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailExists.rows.length > 0) {
      console.log(`Error: Email ${email} already exists!`);
      return res.status(400).json({ error: 'Email already exists' });
    }

    // If the email does not exist, then proceed
    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000);
    verificationData[email] = { code, username, password };

    // Send the verification email
    await sendVerificationEmail(email, code);

    res.json({ message: 'Verification code sent to email. Please verify to complete registration.' });

  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create an endpoint to handle the verification code submission:
router.post('/verify', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (verificationData[email] && verificationData[email].code === Number(code)) {
      // const passwordToHash = verificationData[email].password;         // Uncomment when ready to use hashedPassword
      const username = verificationData[email].username;
      const password = verificationData[email].password;                  // Comment when ready to use hashedPassword
      // const hashedPassword = await bcrypt.hash(passwordToHash, 10);    // Uncomment when ready to use hashedPassword
      
      // Store user details in the database here after hashing the password
      const result = await pool.query("INSERT INTO users (email, username, hashed_password) VALUES($1, $2, $3) RETURNING *", [email, username, password]);    // Change to hashedPassword when ready to use.
      if (result.rows.length > 0) {
        console.log(`User with email ${email} was successfully created in the database!`);
      }

      // Clear the verification code
      delete verificationData[email];
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
router.get("/users", async (req, res) => {
  try {
      const allUsers = await pool.query("SELECT * FROM users");
      res.json(allUsers.rows);
  } catch (err) {
      console.error(err.message);
  }
});


module.exports = router;
