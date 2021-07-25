const pool = require('../database');
const stats = require('../stats/queries');

async function createHabit(user, title, label, color) {
    const habit = await pool.query('INSERT INTO habits (name, title, label, label_color) VALUES ($1, $2, $3, $4) RETURNING *', [user, title, label, color]);
    console.log(user + '\'s habit was added to the database. Title: ' + title);
}

async function getAllHabits(user) {
    const habits = await pool.query('SELECT * FROM habits WHERE name = $1', [user]);
    return habits.rows;
}

module.exports = {createHabit, getAllHabits};