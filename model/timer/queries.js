const pool = require('../database');

//gets most active users (overall)
async function getMostActiveUsers() {
    const users = await pool.query('SELECT name, points from users WHERE points != 0 ORDER BY points DESC');
    return users.rows;
}

module.exports = {getPoints, getNrJournalPages, getNrTasks, removePoints, addPoints, getMostActiveUsers, getUsers, getHabitsStatsByDate};