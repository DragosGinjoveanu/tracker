const pool = require('../database');

async function createTask(user, title, content, date) {
    await pool.query("INSERT INTO tasks (name, title, content, task_date) VALUES ($1, $2, $3, $4) RETURNING *", [user, title, content, date]);
    console.log(user + '\'s task was added in the database');
}

module.exports = {createTask};