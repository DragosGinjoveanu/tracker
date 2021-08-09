const pool = require('../database');
const stats = require('../stats/queries');

async function createToDo(user, title, content, date) {
  await pool.query("INSERT INTO todos (name, title, content, todo_date) VALUES ($1, $2, $3, $4) RETURNING *", [user, title, content, date]);
}

async function getToDosByDay(user, date, status) {
  const result = await pool.query("SELECT id AS id, title AS title, content AS content, todo_date as date FROM todos WHERE name = $1 AND todo_date = $2 AND done = $3 ORDER BY id ASC", [user, date, status]);
  return result.rows;
}

async function getToDosByInterval(user, start_date, end_date, status) {
  const result = await pool.query("SELECT id AS id, title AS title, content AS content, todo_date as date FROM todos WHERE name = $1 AND todo_date >= $2 AND todo_date <= $3 AND done = $4 ORDER BY id ASC", [user, start_date, end_date, status]);
  return result.rows;
}

async function getAllToDos(user, status) {
  const result = await pool.query("SELECT id AS id, title AS title, content AS content, todo_date as date FROM todos WHERE name = $1 AND done = $2 ORDER BY id ASC", [user, status]);
  return result.rows;
}

async function selectToDo(id) {
  const result = await pool.query('SELECT id as id, title AS title, content AS content, todo_date AS date FROM todos WHERE id = $1', [id]);
  return result.rows[0];
}

async function editToDo(title, content, date, id) {
  await pool.query("UPDATE todos SET title = $1, content = $2, todo_date = $3 WHERE id = $4 RETURNING name", [title, content, date, id]);
}

async function deleteToDo(user, id) {
  const result = await pool.query("SELECT done as done FROM todos WHERE id = $1", [id]);
  const done = result.rows[0].done;
  if (done == true) {
    stats.removePoints(user, 10);
  }
  await pool.query( "DELETE FROM todos WHERE id = $1", [id]);
}

async function changeToDoStatus(user, status, id) {
  await pool.query("UPDATE todos SET done = $1 WHERE id = $2", [status, id]);
  if (status == true) {
    stats.addPoints(user, 10);
  } else {
    stats.removePoints(user, 10);
  }
}

module.exports = {createToDo, getToDosByDay, getToDosByInterval, getAllToDos, selectToDo, editToDo, deleteToDo, changeToDoStatus};