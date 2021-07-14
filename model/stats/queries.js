const pool = require('../database');

async function getPoints(user) {
    const res = await pool.query('SELECT points as points FROM users WHERE name = $1', [user]);
    return res.rows[0].points;
}

async function getNrJournalPages(user) {
    const res = await pool.query('SELECT COUNT(*) FROM journals WHERE name = $1', [user]);
    return res.rows[0].count;
}

async function getNrTasks(user, status) {
    const res = await pool.query('SELECT COUNT(*) FROM todos WHERE name = $1 AND done = $2', [user, status]);
    return res.rows[0].count;
}

async function addPoints(user, points) {
    await pool.query('UPDATE users SET points = points + $1 WHERE name = $2', [points, user]);
}

async function removePoints(user, points) {
    await pool.query('UPDATE users SET points = points - $1 WHERE name = $2', [points, user]);
}

module.exports = {getPoints, getNrJournalPages, getNrTasks, removePoints, addPoints};