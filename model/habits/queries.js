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

async function getLabels(user) {
    const labels = await pool.query('SELECT label FROM habits WHERE name = $1', [user]);
    return labels.rows;
}

async function getHabit(user, title) {
    const habits = await pool.query('SELECT * FROM habits WHERE name = $1 AND title = $2', [user, title]);
    return habits.rows[0];
}

async function setHabitCompletion(user, status, id) {
    const current_date = await pool.query('SELECT CURRENT_DATE');
    const habit_date = current_date.rows[0].current_date;
    await pool.query('INSERT INTO habit_completion (name, id, habit_date, status) VALUES ($1, $2, $3, $4)', [user, id, habit_date, status]);
    if (status == true) {
        console.log('Habit id: ' + id + ' was marked as completed on ' + habit_date + '.');
    } else {
        console.log('Habit id: ' + id + ' was marked as uncompleted on ' + habit_date + '.');
    }
}

async function getHabitStatus(user, id, status) {
    const res = await pool.query('SELECT COUNT(*) FROM habit_completion WHERE name = $1 AND id = $2 AND status = $3', [user, id, status]);
    return res.rows[0].count;
}

async function getHabitsByLabel(user, label) {
    if (label == 'no label') {
        const res = await pool.query('SELECT * FROM habits WHERE name = $1 AND label IS NULL', [user]);
        return res.rows;
    }
    const res = await pool.query('SELECT * FROM habits WHERE name = $1 AND label = $2', [user, label]);
    return res.rows;
}

async function deleteHabit(id) {
    await pool.query('DELETE FROM habits WHERE id = $1', [id]);
    console.log('Habit id: ' + id + ' was deleted.');
}

module.exports = {createHabit, getAllHabits, getHabit, setHabitCompletion, getHabitStatus, getHabitsByLabel, deleteHabit, getLabels};