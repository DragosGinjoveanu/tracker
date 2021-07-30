const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');
const authentication = require('../helper/authentication');
const moment = require('moment');

router.get('/top', authentication.restrictUser(), async function(req, res) {
    try {
        const users = await queries.getMostActiveUsers();
        res.render('top', {user: req.session.username, users: users});
    } catch (error) {
        console.log(error.message);
    }
});

router.post('/top', async function(req, res) {
    const selection = req.body.selection;
    if (selection == 'points') {
        res.redirect('http://localhost:3000/stats/top');
    } else {
        try {
            const users = await queries.getUsers(selection);
            res.render('top', {user: req.session.username, users: users});
        } catch (error) {
            console.log(error.message);
        }
    }
});

router.get('/:username', authentication.restrictUser(), async function(req, res) {
    try {
        const name = req.params.username;
        const points = await queries.getPoints(name);
        const pages = await queries.getNrJournalPages(name);
        const doneTasks = await queries.getNrTasks(name, true);
        const undoneTasks = await queries.getNrTasks(name, false);
        //progress bar
        var percentage = parseInt((doneTasks * 100) / (parseInt(doneTasks) + parseInt(undoneTasks)));
        if (isNaN(percentage)) {
            percentage = 0;
        }
        //chart
        var days = [];
        var uncompletedHabits = [];
        var completedHabits = [];
        for (let i = 0; i <= 6; i++) {
            days[i] = moment().subtract(i, 'days').format("YYYY-MM-DD");
            completedHabits[i] = parseInt(await queries.getHabitsStatsByDate(true, days[i], name));
            uncompletedHabits[i] = parseInt(await queries.getHabitsStatsByDate(false, days[i], name));
        }
        //error: pass data to chart.js not working
        const stats = {name, points, pages, doneTasks, undoneTasks, percentage};
        const data = {completedHabits, uncompletedHabits};
        console.log(data.completedHabits)
        res.render('userStats', {user: req.session.username, stats: stats, data: data});
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;