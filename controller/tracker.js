const express = require('express');
const router = express.Router();
const authentication = require('../helper/javascript/authentication');
const functions = require('../helper/javascript/randomMessage.js');
const habits = require('../helper/javascript/homeHabits.js');

//default page when opening app (before logging in)
router.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.redirect('/home')
    } else {
        res.render('tracker');
    }
});

router.get('/home', authentication.restrictUser(), function (req, res) {
    var message = functions.randomMessage();
    res.render('home', {user: req.session.username, message: message, habits: habits});
});

module.exports = router;