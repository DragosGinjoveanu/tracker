const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');
const authentication = require('../helper/validator/authentication');
const statsHelper = require('../helper/stats');

router.get('/top', authentication.restrictUser(), async function(req, res) {
    const users = await queries.getMostActiveUsers();
    const data = await statsHelper.getTopData(users, 'points');
    res.render('top', {user: req.session.username, users: users, data: JSON.stringify(data)});
});

router.post('/top', async function(req, res) {
    let selection = req.body.selection;
    if (selection == 'points') {
        res.redirect('http://localhost:3000/stats/top');
    } else {
        const users = await queries.getUsers(selection);
        selection = 'numberof' + selection;
        const data = await statsHelper.getTopData(users, selection);
        res.render('top', {user: req.session.username, users: users, data: JSON.stringify(data)});
    }
});

router.get('/:username', authentication.restrictUser(), async function(req, res) {
    const name = req.params.username;
    const stats = await statsHelper.getUserStats(name);
    const habits = await statsHelper.getHabitData(name);
    res.render('userStats', {user: req.session.username, stats: stats, habits: JSON.stringify(habits)});
});

module.exports = router;