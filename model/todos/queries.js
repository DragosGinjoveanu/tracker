const pool = require('../database');

async function createTask(user, title, content, date) {
    await pool.query("INSERT INTO todos (name, title, content, todo_date) VALUES ($1, $2, $3, $4) RETURNING *", [user, title, content, date]);
    console.log(user + '\'s todo was added in the database');
}

module.exports = {createTask};