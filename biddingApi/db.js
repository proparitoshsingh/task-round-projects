const Pool = require("pg").Pool;

const pool = new Pool({
   user: "postgres",
   password: "abcd",
   host: "localhost",
   port: 5432,
   database: "bidding"
});

module.exports = pool;