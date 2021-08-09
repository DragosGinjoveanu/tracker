const pool = require('../database');

//gets most active users (overall)
async function getMostActiveUsers() {
    const users = await pool.query('SELECT name, points from users WHERE points != 0 ORDER BY points DESC');
    return users.rows;
}

//gets users by criterion
async function getUsers(table) {
    var users;
    if (table == 'journals') { //gets users by written journal pages
        users = await pool.query('SELECT name, COUNT(*) as numberOfJournals FROM journals GROUP BY name ORDER BY numberOfJournals DESC');
    } else if (table == 'todos') { //gets users by done todos
        users = await pool.query('SELECT name, COUNT(*) as numberOfTodos FROM todos WHERE done = $1 GROUP BY name ORDER BY numberOfTodos DESC', [true]);
    } else if (table == 'habits') { //gets users by completed habits
        users = await pool.query('SELECT name, COUNT(*) as numberOfHabits FROM habit_completion WHERE status = $1 GROUP BY name ORDER BY numberOfHabits DESC', [true]);
    }
    return users.rows;
}

async function getPoints(user) {
    const res = await pool.query('SELECT points as points FROM users WHERE name = $1', [user]);
    return res.rows[0].points;
}

async function getNrJournalPages(user) {
    const res = await pool.query('SELECT COUNT(*) FROM journals WHERE name = $1', [user]);
    return res.rows[0].count;
}

async function getNrTasks(user, status) {
    const res = await pool.query('SELECT COUNT(*) FROM todos WHERE name = $1 AND done = $2', [user, status]);
    return res.rows[0].count;
}

async function getHabitsStatsByDate(status, date, user) {
    const res = await pool.query('SELECT COUNT(*) FROM habit_completion WHERE status = $1 AND habit_date::date = $2 AND name = $3', [status, date, user]);
    return res.rows[0].count;
}

function addPoints(user, points) {
    pool.query('UPDATE users SET points = points + $1 WHERE name = $2', [points, user]);
}

function removePoints(user, points) {
    pool.query('UPDATE users SET points = points - $1 WHERE name = $2', [points, user]);
}

module.exports = {getPoints, getNrJournalPages, getNrTasks, removePoints, addPoints, getMostActiveUsers, getUsers, getHabitsStatsByDate};