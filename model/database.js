const Pool = require("pg").Pool;

const pool = new Pool ({
    user: "postgres",
    password: "password",
    database: "tracker_database", 
    host: "localhost",
    port: 5432
});

module.exports = pool;