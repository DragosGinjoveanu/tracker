const pool = require('../database');

async function createToDo(user, title, content, date) {
    await pool.query("INSERT INTO todos (name, title, content, todo_date) VALUES ($1, $2, $3, $4) RETURNING *", [user, title, content, date]);
    console.log(user + '\'s todo was added in the database');
}

async function getToDos(user, date) {
    try {
        const result = await pool.query("SELECT id AS id, title AS title, content AS content FROM todos WHERE name = $1 AND todo_date = $2 ORDER BY id ASC", [user, date]);
        return result.rows;
      } catch (err) {
        return console.log(err.message);
      }
}

module.exports = {createToDo, getToDos};