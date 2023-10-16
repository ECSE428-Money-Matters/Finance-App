const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {rows} = require("pg/lib/defaults");
const crypto = require('crypto');
const nodemailer = require("nodemailer");


// admin account used to send verification email to user
// TODO: fix
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'money-matters@gmail.com',
        pass: '123456789',
    },
});

// Middleware
app.use(cors());
app.use(express.json());

const db = require('./database'); // Replace with your database setup

app.post('/create-User', async (req, res) => {
  const userData = req.body;

  // Validate input (e.g., username and password)
  if (!userData.username || !userData.password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the user already exists
  const existingUser = await db.getUserByUsername(userData.username);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // generate a random code
  const verif_Code = crypto.randomBytes(6).toString('hex');

  // create mail object that will be sent
  const mailOptions = {
      from: 'money-matters@gmail.com',  // Sender's email address
      to: userData.email,    // Recipient's email address
      subject: 'Email Verification Code',
      text: `Your verification code is: ${verif_Code}`,  // Replace with the actual verification code
    };

    // send the mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error(error);
        return res.status(500).json({error: 'Email could not be sent. Please recheck entered email address.'});
    }
    console.log(`Email sent successfully. ${info.response}`);
});
  
});
app.post('/verify-Email', async (req, res) => {
    const {entered_verif_code} = req.body;
  
    if (entered_verif_code != verif_Code) {
        return res.status(400).json({ error: 'Invalid verification code'});
    }

    // Create the user in the database
    const newUser = await db.createUser(userData);

    res.json({ message: 'User account created successfully', user: newUser });

  });
