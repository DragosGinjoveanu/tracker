const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');

router.get('/', async function(req, res) {
    try {
        const points = await queries.getPoints(req.session.username);
        const pages = await queries.getNrJournalPages(req.session.username);
        const doneTasks = await queries.getNrTasks(req.session.username, true);
        const undoneTasks = await queries.getNrTasks(req.session.username, false);
        var percentage = parseInt((doneTasks * 100) / (parseInt(doneTasks) + parseInt(undoneTasks)));
        if (isNaN(percentage)) {
            percentage = 0;
        }
        const stats = {points, pages, doneTasks, undoneTasks, percentage};
        res.render('userStats', {user: req.session.username, stats: stats});
    } catch (error) {
        console.log(error.message);
    }
});

router.get('/top', async function(req, res) {
    try {
        const users = await queries.getUsers();
        //fara buton see my stats
        res.render('top', {user: req.session.username, users: users});
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;