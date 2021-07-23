const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/habits/queries');
const authentication = require('../helper/javascript/authentication');

//for adding habit from default list (home page)
router.post('/create/:habit', async function(req, res) {
    const user = req.session.username;
    const habit = req.params.habit;
    //label/no label? 
    res.redirect('http://localhost:3000/habits');
});

//gets the user's habits (no labels)
router.get('/', async function(req, res) {
    const user = req.session.username;
    var habits;
});

module.exports = router;