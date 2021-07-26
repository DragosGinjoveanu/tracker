const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/habits/queries');
const authentication = require('../helper/javascript/authentication');

//for adding habit from default list (home page)
router.post('/create/:habit', async function(req, res) {
    const user = req.session.username;
    const habit = req.params.habit;
    try {
        if (req.body.hasOwnProperty("yes")) {
            const label = req.body.label;
            if (label.length == 0) {
                res.render('error', {user: user, message: 'Please add a label', location: '/habits/create/journaling', method: 'POST'});
            } else {
                const color = req.body.color;
                await queries.createHabit(user, habit, label, color);
                res.redirect('http://localhost:3000/habits');
            }
         } else if (req.body.hasOwnProperty("no")){
            await queries.createHabit(user, habit);
            res.redirect('http://localhost:3000/habits');
         } else {
            res.render('habitModal', {user: user, habit: habit, message: 'Do you want to add a label to ' + habit + '?'});
         }
    } catch (error) {
        res.render('error', {user: user, message: 'The habit already exists', location: '/home'});
    }
});

//gets all the user's habits (no labels)
router.get('/', authentication.restrictUser(), async function(req, res) {
    const user = req.session.username;
    var habits = await queries.getAllHabits(user);
    // pt fiecare habit in parte
    for (let i = 0; i < habits.length; i++) {
        const id = habits[i].id;
        const done = await queries.getHabitStatus(user, id, true);
        const undone = await queries.getHabitStatus(user, id, false);
        habits[i].done = done;
        habits[i].undone = undone;
    }
    res.render('habits', {user: user, habits: habits});
});

//marks habit as completed/uncompleted
router.post('/:habit/status', async function(req, res) {
    const user = req.session.username;
    const habit = req.params.habit;
    const habitStats = await queries.getHabit(user, habit);
    const id = habitStats.id;
    if (req.body.hasOwnProperty("plus")) {
        await queries.setHabitCompletion(user, true, id);
    } else if (req.body.hasOwnProperty("minus")) {
        await queries.setHabitCompletion(user, false, id);
    }
    res.redirect('http://localhost:3000/habits');
    //modificam in pug pt fiecare completare/necompletare
});

module.exports = router;