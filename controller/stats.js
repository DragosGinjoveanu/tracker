const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');

router.get('/', async function(req, res) {
    try {
        const points = await queries.getPoints(req.session.username);
        res.render('userStats', {user: req.session.username, points: points.points});
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;