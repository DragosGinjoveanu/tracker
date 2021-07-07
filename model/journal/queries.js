const pool = require('../database');

function createPage(user, title, content) {
    const paste = pool.query("INSERT INTO journals (name, title, content) VALUES ($1, $2, $3) RETURNING *", [user, title, content]);
    console.log(user + '\'s journal page was added in the database');
}

async function journalPages(user) {
    try {
        const result = await pool.query("SELECT id AS id, title AS title, content AS content FROM journals WHERE name = $1 ORDER BY id ASC", [user]);
        return result.rows;
      } catch (err) {
        return console.log(err.message);
      }
}

async function selectPage(id) {
    try {
        const res = await pool.query('SELECT title AS title, content AS content FROM journals WHERE id = $1', [id]);
        return res.rows[0];
      } catch (err){
        return err.stack;
      }
}

function editPage(title, content, id) {
    const page = pool.query("UPDATE journals SET title = $1, content = $2 WHERE id = $3 RETURNING name", [title, content, id]);
    console.log("Page ID: " + id + " was edited");
}

function deletePage(id) {
    const page = pool.query( "DELETE FROM journals WHERE id = $1", [id]);
    console.log("Page ID: " + id + " was deleted");
}

async function getUser(id) {
  try {
    const user = await pool.query('SELECT name AS name FROM journals WHERE id = $1', [id]);
    return user.rows[0];
  } catch (err){
    return err.stack;
  }
}

module.exports = {createPage, journalPages, selectPage, editPage, deletePage, getUser};