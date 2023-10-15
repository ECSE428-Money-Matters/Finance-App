const Pool = require("pg").Pool;

const pool = new Pool({
    user: "MoneyMatters",
    password: "ECSE428",
    host: "127.0.0.1",
    port: 5432,
    database: "MoneyMatters"
});

module.exports = pool;