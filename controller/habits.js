const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/habits/queries');
const authentication = require('../helper/validator/authentication');
const habitValidator = require('../helper/validator/habit');
const habitHelper = require('../helper/habits');
const random = require('../helper/random');

//info of how the habits work for the user
router.get('/info', authentication.restrictUser(), function(req, res) {
    const user = req.session.username;
    res.render('info', {user: user});
});

//for adding habit from default list (home page)
router.post('/:habit/create', async function(req, res) {
    const errorImage = random.randomImage();
    const user = req.session.username;
    const habit = req.params.habit;
    try {
        if (req.body.hasOwnProperty("yes")) {
            if (!habitValidator.checkHabitLabels(req)) {
                return res.render('error', {user: user, message: 'Please check the labels', location: '/habits/' + habit + '/create', method: 'POST', image: errorImage}); 
            }
            const label = req.body.label;
            if (label.length == 0 && req.body.checked != undefined){
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
        res.render('error', {user: user, message: 'The habit already exists', location: '/habits', image: errorImage});
    }
});

//gets all the user's habits (no labels)
router.get('/', authentication.restrictUser(), async function(req, res) {
    const user = req.session.username;
    let habits = await queries.getAllHabits(user);
    habits = await habitHelper.addHabitStats(user, habits);
    const labels = await queries.getLabelsAndColors(user);
    res.render('habits', {user: user, habits: habits, labels: labels, current_label: 'all'});
});

//create custom habit page
router.get('/create', authentication.restrictUser(), function req(req, res) {
    const user = req.session.username;
    res.render('createHabit', {user: user});
});

//redirects to the create habit route for adding labels
router.post('/create/custom', body('title').isLength({ min: 1 }), async function(req, res) {
    const habit = req.body.title;
    const user = req.session.username;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorImage = random.randomImage();
        res.render('error', {user: user, location: '/habits/create', message: 'Please complete the habit\'s title', image: errorImage});
    } else {
        res.redirect(307, '/habits/' + habit + '/create');
    }
});

//marks habit as completed/uncompleted
router.post('/:habit/update_status', async function(req, res) {
    const current_label = req.body.current_label;
    const user = req.session.username;
    const habit = req.params.habit;
    const habitStats = await queries.getHabitByTitle(user, habit);
    const id = habitStats.id;
    if (req.body.hasOwnProperty("plus")) {
        await queries.setHabitCompletion(user, true, id);
    } else if (req.body.hasOwnProperty("minus")) {
        await queries.setHabitCompletion(user, false, id);
    }
    if (current_label == 'all') {
        res.redirect('http://localhost:3000/habits');
    } else {
        res.redirect(307, 'back');
    }
});

//gets habits by their label
router.post('/label', async function(req, res){
    const user = req.session.username;
    let label = req.body.label_selection;
    if (label == undefined) {
        label = req.body.current_label;
    }
    let habits = await queries.getHabitsByLabel(user, label);
    habits = await habitHelper.addHabitStats(user, habits);
    const labels = await queries.getLabelsAndColors(user);
    res.render('habits', {user: user, habits: habits, labels: labels, current_label: label});
});

//gets habits by their color
router.post('/color', async function(req, res){
    const user = req.session.username;
    const label = req.body.current_label;
    let color = req.body.color_selection;
    if (color == undefined) {
        color = label
    }
    let habits = await queries.getHabitsByColor(user, color);
    habits = await habitHelper.addHabitStats(user, habits);
    const labels = await queries.getLabelsAndColors(user);
    res.render('habits', {user: user, habits: habits, labels: labels, current_label: color});
});

//gets selected habit
router.get('/:id/edit', async function(req, res){
    const id = req.params.id;
    const habit = await queries.getHabitById(id);
    res.render('editHabit', {user: req.session.username, habit: habit});
});

//edits habit
router.post('/:id/edit', body('title').isLength({ min: 1 }), async function(req, res){
    const user = req.session.username;
    const id = req.params.id;
    const errors = validationResult(req);
    const errorImage = random.randomImage();
    if (!errors.isEmpty()) {
        res.render('error', {user: user, location: '/habits/' + id + '/edit', message: 'Please complete the habit\'s title', image: errorImage});
    } else {
        try {
            const title = req.body.title;
            let label = req.body.label;
            if (label.length == 0) {
                label = null;
            }
            const color = req.body.color;
            await queries.editHabit(id, title, label, color);
            res.redirect('http://localhost:3000/habits');
        } catch (error) {
            res.render('error', {user: user, message: 'The habit already exists', location: '/habits/' + id + '/edit', image: errorImage});
        }
    }
});

//deletes habit
router.post('/:id/delete', async function(req, res) {
    const id = req.params.id;
    await queries.deleteHabit(id);
    const current_label = req.body.current_label;
    if (current_label == 'all') {
        res.redirect('http://localhost:3000/habits');
    } else {
        res.redirect(307, 'back');
    }
});

//resets habit stats(completions/uncompletions)
router.post('/:id/reset', async function(req, res) {
    const user = req.session.username;
    const id = req.params.id;
    await queries.resetHabitStats(user, id);
    const current_label = req.body.current_label;
    if (current_label == 'all') {
        res.redirect('http://localhost:3000/habits');
    } else {
        res.redirect(307, 'back');
    }
});

module.exports = router;