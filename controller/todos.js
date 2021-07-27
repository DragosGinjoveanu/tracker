const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/todos/queries');
const authentication = require('../helper/authentication');
const moment = require('moment');

//'select todos by date' form
router.get('/', authentication.restrictUser(), function (req, res) {
    res.render('selectToDos', {user: req.session.username});
});

//'create new todo' form page
router.get('/create', authentication.restrictUser(), function (req, res) {
    res.render('createToDo', {user: req.session.username});
});

//gets all the todos
router.get('/view/all', async function (req, res) {
    try {
        const user = req.session.username;
        undoneToDos = await queries.getAllToDos(user, false);
        doneToDos = await queries.getAllToDos(user, true);
        if (undoneToDos.length == 0 && doneToDos.length == 0) {
            res.render('error', {user: req.session.username, location: '/todos', message: 'There are no tasks'});
        } else {
            res.render('todos', {user: user, undoneToDos: undoneToDos, doneToDos: doneToDos, date: '-all-'});
        }
    } catch (error) {
        console.log(error);
    }
});

//gets todos from selected date
router.post('/view', async function (req, res) {
    try {
        const user = req.session.username;
        var date = req.body.date;
        date = moment(date).format('YYYY-MM-DD'); // correct format
        var undoneToDos = await queries.getToDosByDate(user, date, false);
        var doneToDos = await queries.getToDosByDate(user, date, true);
        if (undoneToDos.length == 0 && doneToDos.length == 0) {
            res.render('error', {user: req.session.username, location: '/todos', message: 'There are no tasks on ' + date});
        } else {
            res.render('todos', {user: user, undoneToDos: undoneToDos, doneToDos: doneToDos, date: date});
        }
    } catch (error) {
        res.render('error', {user: req.session.username, location: '/todos', message: 'Please enter valid date'});
    }
});

//gets selected todo
router.get('/:id', authentication.restrictUser(), async function(req, res) {
    var id = req.params.id;
    var todo = await queries.selectToDo(id);
    var todo_date = moment(todo.date).format('YYYY-MM-DD'); // correct format
    res.render('todo', {user: req.session.username, todo: todo, date: todo_date});
});

//adds todo to database and redirects user to all the todos from selected date
router.post('/create', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('error', {user: req.session.username, location: '/todos/create', message: 'Please complete title/description'});
    } else {
        try {
            var user = req.session.username;
            var title = req.body.title;
            var content = req.body.content;
            var date = req.body.date;
            await queries.createToDo(user, title, content, date);
            res.redirect(307, '/todos/view');
        } catch (error) {
            res.render('error', {user: req.session.username, location: '/todos/create', message: 'Please enter valid date'});
        }
    }
});

//edits todo data and redirects user to all the todos from specific date
router.post('/:id/edit', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function(req, res) {
    var id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('error', {user: req.session.username, location: '/todos/' + id, message: 'Please complete title/description'});
    } else {
        try {
            var title = req.body.title;
            var content = req.body.content;
            var date = req.body.date;
            await queries.editToDo(title, content, date, id);
            res.redirect(307, '/todos/view');
        } catch (error) {
            res.render('error', {user: req.session.username, location: '/todos/' + id, message: 'Please enter valid date'});
        }
    }
});

//deletes selected todo
router.post('/:id/delete', async function(req, res) {
    const id = req.params.id;
    const user = req.session.username;
    try {
        await queries.deleteToDo(user, id);
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

module.exports = router;