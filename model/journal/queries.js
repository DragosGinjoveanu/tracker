const pool = require('../database');
const stats = require('../stats/queries');

async function createPage(user, title, content) {
    await pool.query('INSERT INTO journals (name, title, content) VALUES ($1, $2, $3) RETURNING *', [user, title, content]);
    stats.addPoints(user, 10);
}

async function getJournalPages(user) {
    const result = await pool.query('SELECT id AS id, title AS title, content AS content FROM journals WHERE name = $1 ORDER BY id ASC', [user]);
    return result.rows;
}

async function selectPage(id) {
    const res = await pool.query('SELECT title AS title, content AS content FROM journals WHERE id = $1', [id]);
    return res.rows[0];
}

async function editPage(title, content, id) {
    await pool.query('UPDATE journals SET title = $1, content = $2 WHERE id = $3 RETURNING name', [title, content, id]);
}

async function deletePage(user, id) {
    await pool.query('DELETE FROM journals WHERE id = $1', [id]);
    stats.removePoints(user, 10);
}

module.exports = {createPage, getJournalPages, selectPage, editPage, deletePage};