const pool = require('../database');

async function selectUser(name) {
    const user = await pool.query('SELECT name as name, password AS password FROM users WHERE name = $1', [name]);
    return user.rows[0];
}

async function newUser(user, password) {
    const newUser = await pool.query("INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *", [user, password]);
    return newUser.rows[0];
}

async function deleteUser(name) {
    await pool.query('DELETE FROM users WHERE name = $1', [name]);
}

module.exports = {selectUser, newUser, deleteUser};