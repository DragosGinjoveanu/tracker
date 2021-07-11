const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/tasks/queries');

//gets all the tasks (need to implement a calendar to see the given tasks from a specific date)
router.get('/all/', function (req, res) {
    res.send(req.session.username);
});

//create new task form page
router.get('/create/:user', async function (req, res) {
    res.render('createTask', {username: req.params.user});
});

//adds task to database //check if is date
router.post('/create/:user', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('taskError', {location: '/tasks/create/' + req.params.user, message: 'Please complete title/description'});
        console.log(errors);
    } else {
        try {
            var user = req.params.user;
            var title = req.body.title;
            var content = req.body.content;
            var date = req.body.date;
            await queries.createTask(user, title, content, date);
            res.redirect('http://localhost:3000/tasks/all/' + user);
        } catch (error) {
            res.render('taskError', {location: '/tasks/create/' + req.params.user, message: 'Please enter valid date'});
            console.log(error.message);
        }
    }
});

module.exports = router;