const pool = require('../database');

function createPage(user, title, content) {
    const paste = pool.query("INSERT INTO journals (name, title, content) VALUES ($1, $2, $3) RETURNING *", [user, title, content]);
    console.log(user + '\'s journal page was added in the database');
}

async function journalPages(user) {
    try {
        const result = await pool.query("SELECT id AS id, title AS title, content AS content FROM journals WHERE name = $1", [user]);
        return result.rows;
      } catch (err) {
        return console.log(err.message);
      }
}

async function selectPaste(id) {
    try {
        const res = await pool.query('SELECT author AS name, description AS content FROM pastes WHERE pasteId = $1', [id]);
        return res.rows[0];
      } catch (err){
        return err.stack;
      }
}

function editPaste(author, description, id) {
    const paste = pool.query("UPDATE pastes SET author = $1, description = $2 WHERE pasteId = $3", [author, description, id]);
    console.log("Paste ID: " + id + " was edited");
}

function deletePaste(id) {
    const paste = pool.query( "DELETE FROM pastes WHERE pasteId = $1", [id]);
    console.log("Paste ID: " + id + " was deleted");
}

module.exports = {createPage, journalPages, selectPaste, editPaste, deletePaste};