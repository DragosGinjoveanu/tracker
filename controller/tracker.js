const express = require('express');
const router = express.Router();
const authentication = require('../helper/javascript/authentication');

//default page when opening app (before logging in)
router.get('/', function (req, res) {
    res.render('tracker');
});

router.get('/home', authentication.restrictUser(), function (req, res) {
    res.render('home', {user: req.session.username});
});

module.exports = router;