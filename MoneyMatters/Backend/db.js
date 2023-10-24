const Pool = require("pg").Pool;

const pool = new Pool({
    user: "moneymatters",
    password: "ECSE428",
    host: "127.0.0.1",
    port: 5432,
    database: "moneymatters"
});

module.exports = pool;