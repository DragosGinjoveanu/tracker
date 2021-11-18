const express = require('express');
const router = express.Router();
const authentication = require('../helper/validator/authentication');

router.get('/', authentication.restrictUser(), async function(req, res) {
    const user = req.session.username;
    // trb sa luam ultimele "track-uri" din db dupa timp
    res.render('track', {user: user });
});

router.post('/update', async function(req, res) {
    const user = req.session.username;
    console.log('ok');
    res.render('track', {user: user});
});

module.exports = router;
