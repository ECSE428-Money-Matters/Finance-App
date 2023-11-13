const express = require("express");
const cors = require("cors");
const pool = require("./db");
const router = express.Router();

const app = require("./index.js");

router.post("/add_income", async (req, res) => {
  console.log("adding an income");
  try {
    let {
      email,
      income_name,
      amount,
      posted_date,
      category,
      optional_description,
      income_period, //This is the time in days between each instances of this income (second occurence included, so 1 means each day). Less than 1 means the income is a one-shot
    } = req.body;

    // Check for zero dollars
    if (amount === 0) {
      return res.status(400).json({ error: "Amount cannot be zero dollars." });
    }

    // No empty fields
    if (!email || !income_name || !amount || !posted_date || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check for empty title
    if (income_name.trim() === "") {
      return res.status(400).json({ error: "Income title cannot be empty." });
    }

    // Check for invalid amount (non-numeric or negative values)
    if (isNaN(amount) || amount <= 0) {
      return res
        .status(400)
        .json({ error: "Invalid amount. Amount should be a positive number." });
    }

    // avoid empty columns in db
    if (!optional_description) {
      optional_description = "N/A";
    }
    // Check if date is in the future (not needed for income)
    //const currentDate = new Date();
    //const providedDate = new Date(posted_date);
    //if (providedDate > currentDate) {
    //  return res.status(400).json({ error: "Date cannot be in the future." });
    //}

    // add to income table
    const result = await pool.query(
      "INSERT INTO incomes (email, expense_name, amount, posted_date, category, optional_description, income_period) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        email,
        expense_name,
        amount,
        posted_date,
        category,
        optional_description,
        income_period,
      ]
    );

    if (result.rows.length > 0) {
      console.log(`Income added successfully.`);
    }

    res.json({ message: "Income added successfully." });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/view_income", async (req, res) => {
  console.log("viewing income for a user");
  try {
    const { email } = req.query;
    const { column_name } = req.query; //What column to filter (a string that will select all incomes with the specified email and between the two column values)
    const { column_value_start } = req.query;
    const { column_value_end } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const userIncomes = await pool.query(
      "SELECT $2 FROM incomes WHERE email = $1 AND $2 >= $3 AND $2 <= $4 ",
      [email, column_name, column_value_start, column_value_end]
    );
    res.json(userIncomes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
