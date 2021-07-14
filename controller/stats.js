const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');

router.get('/', async function(req, res) {
    try {
        const points = await queries.getPoints(req.session.username);
        const pages = await queries.getNrJournalPages(req.session.username);
        const doneTasks = await queries.getNrTasks(req.session.username, true);
        const stats = {points, pages, doneTasks};
        console.log(stats);
        res.render('userStats', {user: req.session.username, stats: stats});
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;