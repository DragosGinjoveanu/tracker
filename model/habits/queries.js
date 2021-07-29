const pool = require('../database');
const stats = require('../stats/queries');

async function createHabit(user, title, color, label) {
    const habit = await pool.query('INSERT INTO habits (name, title, label, label_color) VALUES ($1, $2, $3, $4) RETURNING *', [user, title, label, color]);
    console.log(user + '\'s habit was added to the database. Title: ' + title);
}

async function getAllHabits(user) {
    const habits = await pool.query('SELECT * FROM habits WHERE name = $1', [user]);
    return habits.rows;
}

async function getHabitByTitle(user, title) {
    const habits = await pool.query('SELECT * FROM habits WHERE name = $1 AND title = $2', [user, title]);
    return habits.rows[0];
}

async function getHabitById(id) {
    const habits = await pool.query('SELECT * FROM habits WHERE id = $1', [id]);
    return habits.rows[0];
}

async function getLabelsAndColors(user) {
    const colors_res = await pool.query('SELECT DISTINCT label_color FROM habits WHERE name = $1', [user]);
    const labels_res = await pool.query('SELECT DISTINCT label FROM habits WHERE name = $1', [user]);
    var labels = {};
    labels.colors = colors_res.rows;
    labels.labels = labels_res.rows;
    return labels;
}

async function getHabitStatus(user, id, status) {
    const res = await pool.query('SELECT COUNT(*) FROM habit_completion WHERE name = $1 AND id = $2 AND status = $3', [user, id, status]);
    return res.rows[0].count;
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

async function getHabitsByLabel(user, label) {
    if (label == 'no label') {
        const res = await pool.query('SELECT * FROM habits WHERE name = $1 AND label IS NULL', [user]);
        return res.rows;
    }
    const res = await pool.query('SELECT * FROM habits WHERE name = $1 AND label = $2', [user, label]);
    return res.rows;
}

async function getHabitsByColor(user, color) {
    const res = await pool.query('SELECT * FROM habits WHERE name = $1 AND label_color = $2', [user, color]);
    return res.rows;
}

async function editHabit(id, title, label, color) {
    await pool.query('UPDATE habits SET title = $1, label = $2, label_color = $3 WHERE id = $4', [title, label, color, id]);
    console.log('Habit id: ' + id + ' was edited.');
}

async function deleteHabit(id) {
    await pool.query('DELETE FROM habits WHERE id = $1', [id]);
    console.log('Habit id: ' + id + ' was deleted.');
}

async function resetHabitStats(id) {
    await pool.query('DELETE FROM habit_completion WHERE id = $1', [id]);
    console.log('Habit id: ' + id + ' has been reset.');
}

module.exports = {createHabit, getAllHabits, getHabitByTitle, getHabitById, getLabelsAndColors, setHabitCompletion, getHabitStatus, getHabitsByLabel, getHabitsByColor, editHabit, deleteHabit, resetHabitStats};