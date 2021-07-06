const express = require('express');
const router = express.Router();
const pool = require('../model/database')

router.get('/', function (req, res) {
    res.render('home');
});

module.exports = router;