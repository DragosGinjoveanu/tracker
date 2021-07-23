const pool = require('../database');
const stats = require('../stats/queries');

async function createHabit(user, title, label) {
    await pool.query("INSERT INTO habits (name, title, label) VALUES ($1, $2, $3) RETURNING *", [user, title, label]);
    console.log(user + '\'s habit was added to the database');
}

module.exports = {createHabit};