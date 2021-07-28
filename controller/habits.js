const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/habits/queries');
const authentication = require('../helper/authentication');
const habitHelper = require('../helper/addHabitStats');

//for adding habit from default list (home page)
router.post('/create/:habit', async function(req, res) {
    const user = req.session.username;
    const habit = req.params.habit;
    try {
        if (req.body.hasOwnProperty("yes")) {
            const label = req.body.label;
            if (label.length == 0 && req.body.checked == undefined) {
                res.render('error', {user: user, message: 'Please add a label', location: '/habits/create/journaling', method: 'POST'});
            } else if (req.body.checked != undefined && label.length != 0) {
                res.render('error', {user: user, message: 'Please remove the label or uncheck the box', location: '/habits/create/journaling', method: 'POST'});
            } else if (label.length == 0 && req.body.checked != undefined){
                //color only
                const color = req.body.color;
                await queries.createHabit(user, habit, color);
                res.redirect('http://localhost:3000/habits');
            } else if (label.length != 0) {
                //color and label
                const color = req.body.color;
                await queries.createHabit(user, habit, color, label);
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

//create custom habit page
router.get('/create', function req(req, res) {
    const user = req.session.username;
    res.render('createHabit', {user: user});
});

//redirects to the create habit route for adding labels
router.post('/custom/create', body('title').isLength({ min: 1 }), async function(req, res) {
    const habit = req.body.title;
    const user = req.session.username;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('error', {user: user, location: '/habits/create', message: 'Please complete the habit\'s title'});
    } else {
        res.redirect(307, '/habits/create/' + habit);
    }
});

//gets all the user's habits (no labels)
router.get('/', authentication.restrictUser(), async function(req, res) {
    const user = req.session.username;
    var habits = await queries.getAllHabits(user);
    habits = await habitHelper.addHabitStats(user, habits);
    const labels = await queries.getLabelsAndColors(user);
    res.render('habits', {user: user, habits: habits, labels: labels});
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
    if ('ok') {
        res.redirect('http://localhost:3000/habits');
    } else {
        res.redirect(307, req.session.habitUrl);
    }
});

router.post('/label', async function(req, res){
    const user = req.session.username;
    const label = req.body.label_selection;
    var habits = await queries.getHabitsByLabel(user, label);
    habits = await habitHelper.addHabitStats(user, habits);
    const labels = await queries.getLabelsAndColors(user);
    res.render('habits', {user: user, habits: habits, labels: labels});
});

router.post('/color', async function(req, res){
    const user = req.session.username;
    const color = req.body.color_selection;
    var habits = await queries.getHabitsByColor(user, color);
    habits = await habitHelper.addHabitStats(user, habits);
    const labels = await queries.getLabelsAndColors(user);
    res.render('habits', {user: user, habits: habits, labels: labels});
});

router.post('/:id/delete', async function(req, res) {
    const id = req.params.id;
    await queries.deleteHabit(id);
    res.redirect('http://localhost:3000/habits');
});

module.exports = router;