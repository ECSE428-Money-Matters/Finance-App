const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {rows} = require("pg/lib/defaults");
var nodeoutlook = require('nodejs-nodemailer-outlook')
const superagent = require('superagent');

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES

// Create an account recovery request
app.post("/recover", async (req,res) => {
    try {
        //console.log(JSON.stringify(req.body));
        const description = req.body// req.body contains the json description data of the example created
        
        //const email = description.email;
        const username = description.username;
        //console.log(JSON.stringify(username));
        refresh();
        //Check if username exists
        const exists = await pool.query("SELECT * FROM Account WHERE username = $1",
        [username]
        );
        if (exists.rows[0] === undefined) return res.json("Account not found");

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
        var message = "Account recovery id: " + recId + "\nCode: " + code+"\nThe request is valid for 1 hour from "+creationdate+".";
        //Mailer functions
        
        nodeoutlook.sendEmail({
            auth: {
                user: "moneymattershere@outlook.com",
                pass: "Th1sisthefin@ncialmail"
            },
            from: 'moneymattershere@outlook.com',
            to: email,
            subject: 'Your recovery code for Finance App',
            text: message,
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
app.post("/recover/setpassword", async (req, res) => {
    try {
        
        refresh();
        const description = req.body;

        const recid = description.accountrecoveryid;
        //console.log(recid)
        const exists = await pool.query("SELECT * FROM accountrecovery WHERE accountrecoveryid = $1",
        [recid]
        );
        if (exists.rows[0] === undefined) return res.json("Account Recovery Request not found");

        const code = description.code;
        const password = description.password;
        
        if (exists.rows[0].code != code) {
            var attempts = await pool.query("SELECT attempts FROM AccountRecovery WHERE accountrecoveryid = $1",
            [recid]);
            var nbattempts = attempts.rows[0].attempts;
            nbattempts--;
            await pool.query("UPDATE AccountRecovery SET attempts = $1 WHERE accountrecoveryid = $2",
            [nbattempts,recid])
            return await res.json("Error, wrong code").redirect('http://127.0.0.1:3000/recover/setpassword');
        }
        //Update password
        const usernameraw = await pool.query("SELECT username FROM AccountRecovery WHERE AccountRecoveryId = $1",
        [recid])
        const username = usernameraw.rows[0].username;
        const updatePassword = await pool.query(
            "UPDATE Account SET password = $1 WHERE username = $2",
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


app.listen(3000, () => {
    console.log("Server started on port 3000");
});

//Refresh database, clear all expired requests or with no attempts 
refresh = () => {
    var datetime = new Date().subHours(1);
    var threshold = 0
    var database = pool.query(
        "DELETE FROM AccountRecovery WHERE creationDate<$1 OR attempts<$2",
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
//Database populating
// pool.query('INSERT INTO account (username,email,password) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
// ["qi","qi.chen6@mcgill.ca","password"]);
// pool.query('INSERT INTO account (username,email,password) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
// ["qiCCC","qiyuanchen@outlook.com","passwordsafe"]);

//Create recovery request
// superagent.post('http://127.0.0.1:3000/recover').send({username: "qiCCC"}).end((err, res) => {
//     if(err){
//         console.log("Post error = ", err )
//     } else {
//         console.log("Post response = ", res.status)
//         console.log(res.body);
//     }
//   });
  //Solve recovery request
//   superagent.post('http://127.0.0.1:3000/recover/setpassword').send({code:'b55af879-23a4-430d-92a8-44c5a90b5c9a', password: 'newpass',accountrecoveryid: 'd9672d2d-886d-49ee-9489-54eff608fa8a'}).end((err, res) => {
//     if(err){
//         console.log("Put error = ", err )
//     } else {
//         console.log("Put response = ", res.status)
//         console.log(res.body);
//     }
//   });