const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/todos/queries');
const authentication = require('../helper/validator/authentication');
const random = require('../helper/random');
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
    const user = req.session.username;
    const undoneToDos = await queries.getAllToDos(user, false);
    const doneToDos = await queries.getAllToDos(user, true);
    if (undoneToDos.length == 0 && doneToDos.length == 0) {
        const errorImage = random.randomImage();
        res.render('error', {user: req.session.username, location: '/todos', message: 'There are no tasks', image: errorImage});
    } else {
        res.render('todos', {user: user, undoneToDos: undoneToDos, doneToDos: doneToDos, date: '-all-'});
    }
});

//gets todos from selected date
router.post('/view/day', async function (req, res) {
    const errorImage = random.randomImage();
    try {
        const user = req.session.username;
        let date = req.body.date;
        date = moment(date).format('YYYY-MM-DD'); //correct format
        const undoneToDos = await queries.getToDosByDay(user, date, false);
        const doneToDos = await queries.getToDosByDay(user, date, true);
        if (undoneToDos.length == 0 && doneToDos.length == 0) {
            res.render('error', {user: req.session.username, location: '/todos', message: 'There are no tasks on ' + date, image: errorImage});
        } else {
            res.render('todos', {user: user, undoneToDos: undoneToDos, doneToDos: doneToDos, date: date});
        }
    } catch (error) {
        res.render('error', {user: req.session.username, location: '/todos', message: 'Please enter valid date', image: errorImage});
    }
});

//gets todos from selected date
router.post('/view/period', body('startDate').isLength({ min: 1 }), body('endDate').isLength({ min: 1 }), async function (req, res) {
    const errorImage = random.randomImage();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('error', {user: req.session.username, location: '/todos', message: "Please complete the 'start' and 'end' dates", image: errorImage});
    } else {
        const user = req.session.username;
        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        //correct format
        startDate = moment(startDate).format('YYYY-MM-DD');
        endDate = moment(endDate).format('YYYY-MM-DD');
        try {
            const undoneToDos = await queries.getToDosByInterval(user, startDate, endDate, false);
            const doneToDos = await queries.getToDosByInterval(user, startDate, endDate, true);
            if (undoneToDos.length == 0 && doneToDos.length == 0) {
                res.render('error', {user: req.session.username, location: '/todos', message: 'There are no tasks between ' + startDate + ' and ' + endDate, image: errorImage});
            } else {
                res.render('todos', {user: user, undoneToDos: undoneToDos, doneToDos: doneToDos, date: startDate + ' -> ' + endDate});
            }
        } catch (error) {
            res.render('error', {user: req.session.username, location: '/todos', message: 'Please enter valid dates', image: errorImage});
        }
    }
});

//gets selected todo
router.get('/:id', authentication.restrictUser(), async function(req, res) {
    const id = req.params.id;
    const todo = await queries.selectToDo(id);
    const todo_date = moment(todo.date).format('YYYY-MM-DD'); //correct format
    res.render('todo', {user: req.session.username, todo: todo, date: todo_date});
});

//adds todo to database and redirects user to all the todos from selected date
router.post('/create', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    const errorImage = random.randomImage();
    if (!errors.isEmpty()) {
        res.render('error', {user: req.session.username, location: '/todos/create', message: 'Please complete title/description', image: errorImage});
    } else {
        try {
            const user = req.session.username;
            const title = req.body.title;
            const content = req.body.content;
            const date = req.body.date;
            await queries.createToDo(user, title, content, date);
            res.redirect(307, '/todos/view/day');
        } catch (error) {
            res.render('error', {user: req.session.username, location: '/todos/create', message: 'Please enter valid date', image: errorImage});
        }
    }
});

//edits todo data and redirects user to all the todos from specific date
router.post('/:id/edit', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function(req, res) {
    const id = req.params.id;
    const errors = validationResult(req);
    const errorImage = random.randomImage();
    if (!errors.isEmpty()) {
        res.render('error', {user: req.session.username, location: '/todos/' + id, message: 'Please complete title/description', image: errorImage});
    } else {
        try {
            const title = req.body.title;
            const content = req.body.content;
            const date = req.body.date;
            await queries.editToDo(title, content, date, id);
            res.redirect(307, '/todos/view/day');
        } catch (error) {
            res.render('error', {user: req.session.username, location: '/todos/' + id, message: 'Please enter valid date', image: errorImage});
        }
    }
});

//deletes selected todo
router.post('/:id/delete', async function(req, res) {
    const id = req.params.id;
    const user = req.session.username;
    await queries.deleteToDo(user, id);
    res.redirect('http://localhost:3000/todos');
});

//marks todo as completed/uncompleted
router.post('/:id/:status', async function(req, res) {
    const id = req.params.id;
    const user = req.session.username;
    let status = req.params.status;
    if (status == 'done') {
        status = true;
    } else {
        status = false;
    }
    await queries.changeToDoStatus(user, status, id);
    res.redirect(307, '/todos/view/day');
});

module.exports = router;