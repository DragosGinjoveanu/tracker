const pool = require('../database');

async function createToDo(user, title, content, date) {
    await pool.query("INSERT INTO todos (name, title, content, todo_date) VALUES ($1, $2, $3, $4) RETURNING *", [user, title, content, date]);
    console.log(user + '\'s todo was added in the database');
}

async function getUndoneToDos(user, date) {
    try {
        const result = await pool.query("SELECT id AS id, title AS title, content AS content FROM todos WHERE name = $1 AND todo_date = $2 AND done = $3 ORDER BY id ASC", [user, date, false]);
        return result.rows;
      } catch (err) {
        return console.log(err.message);
      }
}

async function getDoneToDos(user, date) {
  try {
      const result = await pool.query("SELECT id AS id, title AS title, content AS content FROM todos WHERE name = $1 AND todo_date = $2 AND done = $3 ORDER BY id ASC", [user, date, true]);
      return result.rows;
    } catch (err) {
      return console.log(err.message);
    }
}

async function selectToDo(id) {
  try {
      const result = await pool.query('SELECT title AS title, content AS content, todo_date AS date FROM todos WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err){
      return err.stack;
    }
}

async function editToDo(title, content, date, id) {
  const todo = await pool.query("UPDATE todos SET title = $1, content = $2, todo_date = $3 WHERE id = $4 RETURNING name", [title, content, date, id]);
  console.log("ToDo ID: " + id + " was edited");
}

async function deleteToDo(id) {
  const page = await pool.query( "DELETE FROM todos WHERE id = $1", [id]);
  console.log("ToDo ID: " + id + " was deleted");
}

async function doneToDo(id) {
  const todo = await pool.query("UPDATE todos SET done = $1 WHERE id = $2", [true, id]);
  console.log("ToDo ID: " + id + " was marked as finished");
}

async function undoneToDo(id) {
  const todo = await pool.query("UPDATE todos SET done = $1 WHERE id = $2", [false, id]);
  console.log("ToDo ID: " + id + " was marked as unfinished");
}

module.exports = {createToDo, getUndoneToDos, selectToDo, editToDo, deleteToDo, doneToDo, undoneToDo, getUndoneToDos, getDoneToDos};