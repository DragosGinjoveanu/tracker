const express = require('express');
const router = express.Router();
const authentication = require('../helper/authentication');
const random = require('../helper/random.js');
const habits = require('../helper/homeHabits.js');

//default page when opening app (before logging in)
router.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.redirect('/home')
    } else {
        res.render('tracker');
    }
});

router.get('/home', authentication.restrictUser(), function (req, res) {
    var message = random.randomMessage();
    res.render('home', {user: req.session.username, message: message, habits: habits});
});

module.exports = router;