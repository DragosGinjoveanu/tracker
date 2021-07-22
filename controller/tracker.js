const express = require('express');
const router = express.Router();
const authentication = require('../helper/javascript/authentication');
const functions = require('../public/javascript/functions.js');

//default page when opening app (before logging in)
router.get('/', function (req, res) {
    res.render('tracker');
});

router.get('/home', authentication.restrictUser(), function (req, res) {
    var message = functions.randomMessage();
    res.render('home', {user: req.session.username, message: message});
});

module.exports = router;