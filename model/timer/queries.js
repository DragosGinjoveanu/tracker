const pool = require('../database');

//gets most active users (overall)
async function getTracker(user) {
    const trackers = await pool.query('SELECT name, points from users WHERE points != 0 ORDER BY points DESC');
    return trackers.rows;
}

module.exports = {getTracker};