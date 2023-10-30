// const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const router = express.Router();


const app = require('./index.js');

// TODO:
// refund?
// need to fix invalid amount, 0 dollars, when not logged in?
router.post('/add_expense', async (req, res) => {
    console.log("adding an expense");
    try {

        const {  user_id, expense_name, amount, posted_date, category, optional_description } = req.body;

        // Check if any required field is empty
        if (!user_id || !expense_name ||  !amount || !posted_date || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Check for empty title
        if (expense_name.trim() === '') {
            return res.status(400).json({ error: 'Expense title cannot be empty.' });
        }

        // Check for invalid amount (non-numeric or negative values)
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount. Amount should be a positive number.' });
        }

        // Check for zero dollars
        if (amount == 0) {
            return res.status(400).json({ error: 'Amount cannot be zero dollars.' });
        }

        // avoid empty columns in db
        if (!optional_description) {
            optional_description = "N/A";
        }

        // Check if date is in the future
        const currentDate = new Date();
        const providedDate = new Date(posted_date);
        if (providedDate > currentDate) {
            return res.status(400).json({ error: 'Date cannot be in the future.' });
        }

        // add to expenses table
        const result = await pool.query(
            "INSERT INTO expenses ( user_id, expense_name, amount, posted_date, category, optional_description) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", 
            [user_id, expense_name, amount, posted_date, category, optional_description]);  

            if (result.rows.length > 0) {
                console.log(`Expense added successfully.`);
            }

        res.json({ message: 'Expense added successfully.' });

    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/view_expense', async (req, res) => {
    console.log("viewing all expenses");
    try {
        const allExpenses = await pool.query("SELECT * FROM expenses");
        res.json(allExpenses.rows);
    } catch (err) {
        console.error(err.message);
    }
});

module.exports = router;

// get all expenses linked to a user
// get specific expense




