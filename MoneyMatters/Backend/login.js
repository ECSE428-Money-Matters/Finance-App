const loginAttempts = {};
const express = require("express");
const router = express.Router();
const pool = require("./db");
const app = require('./index.js');

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (loginAttempts[email] >= 3) {
            return res.json("Too many login attempts. Select 'Forgot Password' to proceed.");
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) {
            return res.json("Email not found");
        }

        console.log(user.rows[0]);

        if (user.rows[0].hashed_password != password) {
            loginAttempts[email] = (loginAttempts[email] || 0) + 1;
            return res.json("Invalid password");
        }

        // Reset login attempts
        loginAttempts[email] = 0;

        res.json("Login successful");

    } catch (err) {
        console.error(err.message);
    }
});

router.post("/logout", (req, res) => {
    // Not much to do here
    res.json("Logout successful");
});

module.exports = router;