const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');
const authentication = require('../helper/validator/authentication');
const moment = require('moment');

router.get('/top', authentication.restrictUser(), async function(req, res) {
    const users = await queries.getMostActiveUsers();
    let stats = [];
    let labels = [];
    for (let i = 0; i < users.length; i++) {
        stats[i] = parseInt(users[i].points);
        labels[i] = users[i].name;
    }
    const data = {stats, labels};
    res.render('top', {user: req.session.username, users: users, data: JSON.stringify(data)});
});

router.post('/top', async function(req, res) {
    const selection = req.body.selection;
    if (selection == 'points') {
        res.redirect('http://localhost:3000/stats/top');
    } else {
        const users = await queries.getUsers(selection);
        let stats = [];
        let labels = [];
        const prop = 'numberof' + selection;
        for (let i = 0; i < users.length; i++) {
            stats[i] = parseInt(users[i][prop]);
            labels[i] = users[i].name;
        }
        const data = {stats, labels};
        res.render('top', {user: req.session.username, users: users, data: JSON.stringify(data)});
    }
});

router.get('/:username', authentication.restrictUser(), async function(req, res) {
    const name = req.params.username;
    const points = await queries.getPoints(name);
    const pages = await queries.getNrJournalPages(name);
    const doneTasks = await queries.getNrTasks(name, true);
    const undoneTasks = await queries.getNrTasks(name, false);
    //progress-bar for the to-dos
    let percentage = parseInt((doneTasks * 100) / (parseInt(doneTasks) + parseInt(undoneTasks)));
    if (isNaN(percentage)) {
        percentage = 0;
    }
    const stats = {name, points, pages, doneTasks, undoneTasks, percentage};
    //chart.js - habit completion data from last 7 days
    let days = [];
    let uncompletedHabits = [];
    let completedHabits = [];
    for (let i = 0; i <= 6; i++) {
        days[i] = moment().subtract(i, 'days').format("YYYY-MM-DD");
        completedHabits[i] = parseInt(await queries.getHabitsStatsByDate(true, days[i], name));
        uncompletedHabits[i] = parseInt(await queries.getHabitsStatsByDate(false, days[i], name));
    }
    const habits = {completedHabits, uncompletedHabits, days};
    res.render('userStats', {user: req.session.username, stats: stats, habits: JSON.stringify(habits)});
});

module.exports = router;