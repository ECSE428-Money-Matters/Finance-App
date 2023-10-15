const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {rows} = require("pg/lib/defaults");

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES

// Create an example
app.post("/examples", async (req,res) => {
    try {
        const { description } = req.body// req.body contains the json description data of the example created
        const newExample = await pool.query(
            "INSERT INTO exampletable (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newExample.rows[0]);
    }catch (err){
        console.error(err.message);
    }
});
// Get all examples

app.get("/examples", async (req,res) =>{
    try {
        const allExamples = await pool.query("SELECT * FROM exampletable");
        res.json(allExamples.rows);
    }catch (err){
        console.error((err.message));
    }
});
// Get an example

app.get("/examples/:id", async (req, res) =>{
    try {
        const {id} = req.params;
        const example = await pool.query("SELECT * FROM exampletable WHERE example_id = $1", [id]);
        res.json(example.rows[0]);
    }catch (err){
        console.error(err.message);
    }
})
// Update an example

app.put("/examples/:id", async (req, res) => {
   try {
       const {id} = req.params;
       const {description} = req.body;
       const updateExample = await pool.query(
           "UPDATE exampletable SET description = $1 WHERE example_id = $2",
           [description, id]
           );
       res.json("Example was updated");
   } catch (err) {
       console.error(err.message);
   }
});

// Delete an example
app.delete("/examples/:id", async (req, res) =>{
   try {
     const {id} = req.params;
     const deleteExample = await pool.query(
         "DELETE FROM exampletable WHERE example_id = $1",
         [id]
         );
     res.json("Example was deleted");
   } catch (err) {
       console.error(err.message);
   }
});
app.listen(3000, () => {
    console.log("Server started on port 3000");
});