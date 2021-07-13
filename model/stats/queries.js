const pool = require('../database');

async function getPoints (user){
    const res = await pool.query('SELECT points as points FROM users WHERE name = $1', [user]);
    return res.rows[0];
}


module.exports = {getPoints};