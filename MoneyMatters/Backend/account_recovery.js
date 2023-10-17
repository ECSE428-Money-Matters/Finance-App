const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {rows} = require("pg/lib/defaults");
const sendmail = require('sendmail');
const superagent = require('superagent');

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES

// Create an account recovery request
app.post("/recover", async (req,res) => {
    try {
        const { description } = req.body// req.body contains the json description data of the example created
        //const email = description.email;
        const username = description.username;
        refresh();
        //Check if username exists
        const exists = await pool.query("EXISTS(SELECT * FROM Account WHERE username = $2)",
        [email,username]
        );
        if (!exists) return res.json("Account not found");

        //Delete duplicate if exists (not implemented)
        //await pool.query("DELETE from AccountRecovery WHERE email = $1",[email]);

        const email = await pool.query("SELECT email FROM Account WHERE username = $1",
        [username]);

        const newRecoveryRequest = await pool.query(
            "INSERT INTO AccountRecovery (email,username) VALUES($1,$2) RETURNING *",
            [email,username]
        );

        //Send email with the code and recovery id
        const code = newRecoveryRequest.rows[0].code;
        const recId = newRecoveryRequest.rows[0].AccountRecoveryId;
        //Mailer functions
        sendmail({
            from: 'no-reply@financialappmail.com',
            to: email,
            subject: 'Your code for password recovery',
            html: 'Recovery id: '+recId+"\nCode: "+code,
        }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });

        res.json(newRecoveryRequest.rows[0]);
    }catch (err){
        console.error(err.message);
    }
});

//Recover an account's password
app.put("/recover/:recid", async (req, res) => {
    try {
        refresh();
        const {recid} = req.params;
        const {description} = req.body;
        
        if (! await pool.query("EXISTS(SELECT * FROM AccountRecovery WHERE AccountRecoveryId = $1)",
        [recid])) return res.status(404).json("Error, recovery id not found");

        const code = description.code;
        const password = description.password;
        
        if (! await pool.query("EXISTS(SELECT * FROM AccountRecovery WHERE AccountRecoveryId = $1 AND code = $2)",
        [recid, code])) {
            const attempts = await pool.query("SELECT attempts FROM AccountRecovery WHERE AccountRecoveryId = $1",
            [recid]);
            attempts--;
            await pool.query("UPDATE AccountRecovery SET attempts = $1 WHERE AccountRecoveryId = $2",
            [attempts,recid])
            location.reload();
            return res.json("Error, wrong code");
        }
        //Update password
        const username = pool.query("SELECT username FROM AccountRecovery WHERE AccountRecoveryId = $1",
        [recid])
        const updatePassword = await pool.query(
            "UPDATE Account SET password = $1 WHERE username = $2",
            [description, username]
            );
        res.json("Password was updated");
    } catch (err) {
        console.error(err.message);
    }
 });


app.listen(3000, () => {
    console.log("Server started on port 3000");
});

//Refresh database, clear all expired requests or with no attempts 
refresh = () => {
    var datetime = new Date().subHours(1);
    var threshold = 0
    var database = pool.query(
        "DELETE FROM AccountRecovery WHERE creationDate<$1 OR attemps<$2",
        [datetime,threshold]
    );

};

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.subHours = function (h) {
    this.setTime(this.getTime() - (h * 60 * 60 * 1000));
    return this;
}

//Rudimentary testing
pool.query('INSERT INTO account (username,email,password) VALUES($1,$2,$3) WHERE NOT EXISTS(SELECT username FROM account WHERE username=$1)',
["qi","qi.chen6@mcgill.ca","password"]);

superagent.post('http://localhost:3000/recover').send({username: "qi"}).end((err, res) => {

  });