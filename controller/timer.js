const express = require('express');
const router = express.Router();
const queries = require('../model/stats/queries');
const authentication = require('../helper/validator/authentication');

router.get('/', authentication.restrictUser(), async function(req, res) {
    const user = req.session.username;
    //const trackers = await queries.getTrackers(user);
    // trb sa luam ultimele "track-uri" din db dupa timp
    res.render('track', {user: user });
});

router.post('/update', async function(req, res) {
    const user = req.session.username;
    // update database
    res.render('track', {user: user});
});

module.exports = router;
