const express = require('express');
const router = express.Router();
const authentication = require('../helper/validator/authentication');
const random = require('../helper/random');
const habits = require('../helper/habits');

//default page when opening app (before logging in)
router.get('/', function (req, res) {
    if (req.session.loggedin) {
        res.redirect('/home')
    } else {
        res.render('tracker');
    }
});

router.get('/home', authentication.restrictUser(), function (req, res) {
    const message = random.randomMessage();
    res.render('home', {user: req.session.username, message: message, habits: habits});
});

module.exports = router;