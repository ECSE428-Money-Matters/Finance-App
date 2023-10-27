const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {rows} = require("pg/lib/defaults");
var nodeoutlook = require('nodejs-nodemailer-outlook')
const superagent = require('superagent');
const router = express.Router();

// Middleware
router.use(cors());
router.use(express.json());

// ROUTES

// Create an account recovery request
router.post("/recover", async (req,res) => {
    try {
        //console.log(JSON.stringify(req.body));
        const description = req.body// req.body contains the json description data of the example created
        
        //const email = description.email;
        const username = description.username;
        //console.log(JSON.stringify(username));
        refresh();
        //Check if username exists
        const exists = await pool.query("SELECT * FROM users WHERE username = $1",
        [username]
        );
        if (exists.rows[0] === undefined) return res.status(404).json("Account not found");

        //Delete duplicate if exists (not implemented)
        //await pool.query("DELETE from AccountRecovery WHERE email = $1",[email]);

        const email = exists.rows[0].email;

        const newRecoveryRequest = await pool.query(
            "INSERT INTO AccountRecovery (email,username) VALUES($1,$2) RETURNING *",
            [email,username]
        );

        //Send email with the code and recovery id
        const code = newRecoveryRequest.rows[0].code;
        const recId = newRecoveryRequest.rows[0].accountrecoveryid;
        const creationdate = newRecoveryRequest.rows[0].creationdate;
        const host = req.get("host");
        var message = "<html><body><p>Account recovery id: " + recId + "<br>Code: " + code+"<br>The request is valid for 1 hour from "+creationdate+"."+
        '<br><a href="' + "http://" + host + "/recover/setpassword/" + recId + '">Click here to reset your password</a>';
        //console.log(message);
        //Mailer functions
        
        nodeoutlook.sendEmail({
            auth: {
                user: "moneymattershere@outlook.com",
                pass: "Th1sisthefin@ncialmail"
            },
            from: 'moneymattershere@outlook.com',
            to: email,
            subject: 'Your recovery code for MoneyMatters',
            html: message,
            onError: (e) => console.log(e),
            onSuccess: (i) => console.log(i)
        }
        );

        res.json(newRecoveryRequest.rows[0]);
    }catch (err){
        console.error(err.message);
    }
});

//Recover an account's password
router.put("/recover/setpassword/:recid", async (req, res) => {
    try {
        
        refresh();
        const description = req.body;

        const recid = req.params.recid;
        //console.log(recid)
        const exists = await pool.query("SELECT * FROM accountrecovery WHERE accountrecoveryid = $1",
        [recid]
        );
        if (exists.rows[0] === undefined) return res.status(404).json("Account Recovery Request not found");

        const code = description.code;
        const password = description.password;
        
        if (exists.rows[0].code != code) {
            refresh();
            var attempts = await pool.query("SELECT attempts FROM AccountRecovery WHERE accountrecoveryid = $1",
            [recid]);
            var nbattempts = attempts.rows[0].attempts;
            nbattempts--;
            await pool.query("UPDATE AccountRecovery SET attempts = $1 WHERE accountrecoveryid = $2",
            [nbattempts,recid])
            if (nbattempts == 0) {
                return res.json("Error, wrong code. No more attemps accepted for this request");
            }
            return res.status(400).json("Error, wrong code. "+nbattempts + " attempts left.")
        }
        //Update password
        const usernameraw = await pool.query("SELECT username FROM AccountRecovery WHERE AccountRecoveryId = $1",
        [recid])
        const username = usernameraw.rows[0].username;
        const updatePassword = await pool.query(
            "UPDATE users SET hashed_password = $1 WHERE username = $2",
            [password, username]
            );
        //Delete request
        await pool.query("DELETE FROM AccountRecovery WHERE AccountRecoveryId = $1",
        [recid])
        res.json("Password was updated");
    } catch (err) {
        console.error(err.message);
    }
 });

//Refresh account recovery database, clear all expired requests or with no attempts 
refresh = () => {
    var datetime = new Date().subHours(1);
    var threshold = 0
    var database = pool.query(
        "DELETE FROM AccountRecovery WHERE creationDate<$1 OR attempts=$2",
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

module.exports = router;

// Rudimentary testing
// Database populating
// pool.query('INSERT INTO account (username,email,password) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
// ["qi","qi.chen6@mcgill.ca","password"]);
// pool.query('INSERT INTO account (username,email,password) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
// ["qiCCC","qiyuanchen@outlook.com","passwordsafe"]);

// Create recovery request
// superagent.post('http://127.0.0.1:3000/recover').send({username: "qiCCC"}).end((err, res) => {
//     if(err){
//         console.log("Post error = ", err )
//     } else {
//         console.log("Post response = ", res.status)
//         console.log(res.body);
//     }
//   });
//   Solve recovery request
//   superagent.put('http://127.0.0.1:3000/recover/setpassword/15e773cf-5caa-46c6-b5d3-e375cb67e394').send({code:'c5d16b01-4702-4f2c-b174-44724bd265a3', password: 'newpass'}).end((err, res) => {
//     if(err){
//         console.log("Put error = ", err )
//     } else {
//         console.log("Put response = ", res.status)
//         console.log(res.body);
//     }
//   });