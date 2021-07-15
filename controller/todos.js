const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/todos/queries');
const moment = require('moment');

//'select todos by date' form
router.get('/', function (req, res) {
    res.render('selectToDos', {user: req.session.username});
});

//'create new todo' form page
router.get('/create', function (req, res) {
    res.render('createToDo', {user: req.session.username});
});

//gets todos from selected date
router.post('/view', async function (req, res) {
    try {
        var user = req.session.username;
        var date = req.body.date;
        var undoneToDos = await queries.getUndoneToDos(user, date);
        var doneToDos = await queries.getDoneToDos(user, date);
        if (undoneToDos.length == 0 && doneToDos.length == 0) {
            res.render('toDoError', {user: req.session.username, location: '/todos', message: 'There are no tasks on ' + date});
        } else {
            res.render('todos', {user: user, undoneToDos: undoneToDos, doneToDos: doneToDos, date: date});
        }
    } catch (error) {
        res.render('toDoError', {user: req.session.username, location: '/todos', message: 'Please enter valid date'});
    }
});

//gets selected todo
router.get('/:id', async function(req, res) {
    var id = req.params.id;
    var todo = await queries.selectToDo(id);
    var todo_date = moment(todo.date).format('YYYY-MM-DD'); // correct format
    res.render('todo', {user: req.session.username, todo: todo, date: todo_date});
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

//edits todo data
router.post('/:id/edit', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function(req, res) {
    var id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('toDoError', {user: req.session.username, location: '/todos/' + id, message: 'Please complete title/description'});
    } else {
        try {
            var title = req.body.title;
            var content = req.body.content;
            var date = req.body.date;
            await queries.editToDo(title, content, date, id);
            res.redirect(307, '/todos/view');
        } catch (error) {
            res.render('toDoError', {user: req.session.username, location: '/todos/' + id, message: 'Please enter valid date'});
        }
    }
});

//deletes selected todo
router.post('/:id/delete', async function(req, res) {
    var id = req.params.id;
    try {
        await queries.deleteToDo(id);
        res.redirect('http://localhost:3000/todos');
    } catch (error) {
        console.log(error.message);
    }
});

//marks todo as completed/uncompleted
router.post('/:id/:status', async function(req, res) {
    var id = req.params.id;
    var status = req.params.status;
    if (status == 'done') {
        status = true;
    } else {
        status = false;
    }
    try {
        await queries.changeToDoStatus(req.session.username, status, id);
        res.redirect(307, '/todos/view');
    } catch (error) {
        console.log(error.message);
    }
});
//commit - modified redirect routes
module.exports = router;