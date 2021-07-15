const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');

router.get('/top', async function(req, res) {
    try {
        const users = await queries.getUsers('points');
        res.render('top', {user: req.session.username, users: users});
    } catch (error) {
        console.log(error.message);
    }
});

router.post('/top', async function(req, res) {
    const selection = req.body.selection;
    console.log(selection);
    try {
        const users = await queries.getUsers(selection);
        res.render('top', {user: req.session.username, users: users});
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/:username', async function(req, res) {
    try {
        const name = req.params.username;
        const points = await queries.getPoints(name);
        const pages = await queries.getNrJournalPages(name);
        const doneTasks = await queries.getNrTasks(name, true);
        const undoneTasks = await queries.getNrTasks(name, false);
        var percentage = parseInt((doneTasks * 100) / (parseInt(doneTasks) + parseInt(undoneTasks)));
        if (isNaN(percentage)) {
            percentage = 0;
        }
        const stats = {name, points, pages, doneTasks, undoneTasks, percentage};
        res.render('userStats', {user: req.session.username, stats: stats});
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;