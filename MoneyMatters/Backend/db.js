const Pool = require("pg").Pool;

const pool = new Pool({
    user: "MoneyMatters",
    password: "ECSE428",
    host: "localhost",
    port: 5432,
    database: "MoneyMatters"
});

module.exports = pool;