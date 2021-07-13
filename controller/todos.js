const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/todos/queries');

//'select todos by date' form
router.get('/', function (req, res) {
    res.render('selectToDos', {user: req.session.username});
});

//'create new todo' form page
router.get('/create', function (req, res) {
    res.render('createToDo', {user: req.session.username});
});

//gets selected todo
router.get('/:id', async function(req, res) {
    var id = req.params.id;
    var todo = await queries.selectToDo(id);
    res.render('todo', {user: req.session.username, todo: todo, id: id});
});

//gets todos from selected date
router.post('/view', async function (req, res) {
    try {
        var user = req.session.username;
        var date = req.body.date;
        var todos = await queries.getToDos(user, date);
        if (todos.length == 0) {
            res.render('toDoError', {user: req.session.username, location: '/todos', message: 'There are no tasks on ' + date});
        }
        res.render('todos', {user: user, todos: todos, date: date});
    } catch (error) {
        res.render('toDoError', {user: req.session.username, location: '/todos', message: 'Please enter valid date'});
    }
});

//adds todo to database
router.post('/create', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('toDoError', {user: req.session.username, location: '/todos/create', message: 'Please complete title/description'});
    } else {
        try {
            var user = req.session.username;
            var title = req.body.title;
            var content = req.body.content;
            var date = req.body.date;
            await queries.createToDo(user, title, content, date);
            res.redirect('http://localhost:3000/todos');
        } catch (error) {
            res.render('toDoError', {user: req.session.username, location: '/todos/create', message: 'Please enter valid date'});
        }
    }
});

module.exports = router;