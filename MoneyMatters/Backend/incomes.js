const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const superagent = require("superagent");
const router = express.Router();
const { rows } = require("pg/lib/defaults");

// Middleware
router.use(cors());
router.use(express.json());

router.post("/incomes", async (req, res) => {
  console.log("adding an income");
  try {
    const description = req.body;
    const email = description.email;
    const income_name = description.income_name;
    const amount = description.amount;
    const posted_date = description.posted_date;
    const category = description.category;
    const optional_description = description.optional_description;
    const income_period = description.income_period; //This is the time in days between each instances of this income (second occurence included, so 1 means each day). Less than 1 means the income is a one-shot

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
      "INSERT INTO incomes (email, income_name, amount, posted_date, category, optional_description, income_period) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        email,
        income_name,
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

router.get("/incomes", async (req, res) => {
  console.log("viewing income for a user");
  try {
    const { email } = req.body;
    const { column_name } = req.body; //What column to filter (a string that will select all incomes with the specified email and between the two column values)
    const { column_value_start } = req.body;
    const { column_value_end } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    var queryInput =
      "SELECT * FROM incomes WHERE email = $1 AND " +
      column_name +
      " >= $2 AND " +
      column_name +
      " <= $3 ";
    //If column_name = "None", then query without filtering
    if (column_name === "None")
      queryInput = "SELECT * FROM incomes WHERE email = $1";
    const userIncomes = await pool.query(queryInput, [
      email,
      column_value_start,
      column_value_end,
    ]);
    console.log("Filtered income");
    console.log(userIncomes.rows);
    res.json(userIncomes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;

// Tests
// superagent
//   .post("http://127.0.0.1:3000/incomes")
//   .send({
//     email: "qi.chen6@mail.mcgill.ca",
//     income_name: "Test",
//     amount: "69",
//     posted_date: new Date(),
//     category: "Testcat",
//     optional_description: "Desc",
//     income_period: "1",
//   })
//   .end((err, res) => {
//     if (err) {
//       console.log("Post error = ", err);
//     } else {
//       console.log("Post response = ", res.status);
//       console.log(res.body);
//     }
//   });

// superagent
//   .post("http://127.0.0.1:3000/incomes")
//   .send({
//     email: "qi.chen6@mail.mcgill.ca",
//     income_name: "Test",
//     amount: "69",
//     posted_date: new Date(),
//     category: "Testcat",
//     optional_description: "Desc",
//     income_period: "99",
//   })
//   .end((err, res) => {
//     if (err) {
//       console.log("Post error = ", err);
//     } else {
//       console.log("Post response = ", res.status);
//       console.log(res.body);
//     }
//   });

// superagent
//   .get("http://127.0.0.1:3000/incomes")
//   .send({
//     email: "qi.chen6@mail.mcgill.ca",
//     column_name: "income_period",
//     column_value_start: "1",
//     column_value_end: "1",
//   })
//   .end((err, res) => {
//     if (err) {
//       console.log("Get error = ", err);
//     } else {
//       console.log("Get response = ", res.status);
//       console.log(res.body);
//     }
//   });
