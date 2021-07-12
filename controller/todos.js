const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/todos/queries');

//gets all the todos (need to implement a calendar to see the given tasks from a specific date)
router.get('/', function (req, res) {
    res.send(req.session.username);
});

//'create new todo' form page
router.get('/create', async function (req, res) {
    res.render('createToDo', {username: req.session.username});
});

//adds todo to database
router.post('/create', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('toDoError', {location: '/todos/create', message: 'Please complete title/description'});
    } else {
        try {
            var user = req.session.username;
            var title = req.body.title;
            var content = req.body.content;
            var date = req.body.date;
            await queries.createTask(user, title, content, date);
            res.redirect('http://localhost:3000/todos');
        } catch (error) {
            res.render('toDoError', {location: '/todos/create', message: 'Please enter valid date'});
        }
    }
});

module.exports = router;