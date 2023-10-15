const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES

// Create an example
app.post("/examples", async (req,res) => {
    try {
        const { description } = req.body// req.body contains the json description data of the example created
        const newExample = await pool.query(
            "INSERT INTO exampleTable (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newExample.rows[0]);
    }catch (err){
        console.error(err.message);
    }
});
// Get all examples

app.get("/todos", async (req,res) =>{
    try {

    }catch (err){
        console.error((err.message));
    }
})
// Get an example

// Update an example

// Delete an example
app.listen(3000, () => {
    console.log("Server started on port 3000");
});