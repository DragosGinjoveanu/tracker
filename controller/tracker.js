const express = require('express');
const router = express.Router();
const pool = require('../model/database')

router.get('/', function (req, res) {
    res.render('home');
});

router.get('/:user', function (req, res) {
    res.render('user', {user: req.params.user});
});

module.exports = router;