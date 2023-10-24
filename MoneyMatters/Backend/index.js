const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const {rows} = require("pg/lib/defaults");
const loginAttempts = {};

const create_user = require('./create-user');
const login = require('./login.js');
const recover = require('./account_recovery.js')

// Middleware
app.use(cors());
app.use(express.json());

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server started on port 3000");
    });
}

app.use((req, res, next) => {
    console.log(`Received ${req.method} request on ${req.path}`);
    next();
});


// ROUTES
app.use(create_user)
app.use(login);
app.use(recover);

module.exports = app;
