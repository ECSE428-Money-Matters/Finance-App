const express = require('express');
const cors = require('cors');
const pool = require('./db');
const router = express.Router();

const app = require('./index.js');

router.post('/add_expense', async (req, res) => {
    console.log("adding an expense");
    try {
        let { email, expense_name, amount, posted_date, category, optional_description } = req.body;

        // Check for zero dollars
        if (amount === 0) {
            return res.status(400).json({ error: 'Amount cannot be zero dollars.' });
        }

        // No empty fields
        if (!email || !expense_name ||  !amount || !posted_date || !category) {
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
            "INSERT INTO expenses (email, expense_name, amount, posted_date, category, optional_description) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
            [email, expense_name, amount, posted_date, category, optional_description]
        );

        if (result.rows.length > 0) {
            console.log(`Expense added successfully.`);
        }

        res.json({ message: 'Expense added successfully.' });

    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Junaid: Edited this slightly to account for viewing expenses using future date selections
router.get('/view_expense', async (req, res) => {
    console.log("viewing expenses for a user");
    try {
        const { email } = req.query;
        const { month } = req.query; // Extracting the 'month' query parameter
       
        if (!email) {
            return res.status(400).json({ error: 'Email is required.' });
        }

        // Check if the 'month' query parameter exists and is a future date
        if (month) {
            const currentMonth = new Date().toISOString().slice(0, 7);
            if (month > currentMonth) {
                return res.status(400).json({ message: 'No expenses found for the selected month' });
            }
        }

        const userExpenses = await pool.query("SELECT * FROM expenses WHERE email = $1", [email]);
        res.json(userExpenses.rows);

    } catch (err) {
        console.error(err.message);
    }
});


module.exports = router;

