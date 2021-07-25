const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/habits/queries');
const authentication = require('../helper/javascript/authentication');

//for adding habit from default list (home page)
router.post('/create/:habit', async function(req, res) {
    const user = req.session.username;
    const habit = req.params.habit;
    if (req.body.hasOwnProperty("yes")) {
        const label = req.body.label;
        if (label.length == 0) {
            //combine error templates
            res.render('error', {message: 'Please add a label', location: '/habits/create/journaling'});
        } else {
            const color = req.body.color;
            await queries.createHabit(user, habit, label, color);
            res.redirect('http://localhost:3000/habits');
        }
     } else if (req.body.hasOwnProperty("no")){
        await queries.createHabit(user, habit);
        res.redirect('http://localhost:3000/habits');
     } else {
        res.render('habitModal', {habit: habit, message: 'Do you want to add a label to ' + habit + '?'});
     }
});

//gets the user's habits (no labels)
router.get('/', authentication.restrictUser(), async function(req, res) {
    const user = req.session.username;
    var habits = await queries.getAllHabits(user);
    console.log(habits, user)
    res.render('habits', {habits: habits});
});

module.exports = router;