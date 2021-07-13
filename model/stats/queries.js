const pool = require('../database');

async function getPoints(user) {
    const res = await pool.query('SELECT points as points FROM users WHERE name = $1', [user]);
    return res.rows[0];
}

async function addPoints(user, points) {
    await pool.query('UPDATE users SET points = points + $1 WHERE name = $2', [points, user]);
}

async function removePoints(user, points) {
    await pool.query('UPDATE users SET points = points - $1 WHERE name = $2', [points, user]);
}


module.exports = {getPoints, removePoints, addPoints};