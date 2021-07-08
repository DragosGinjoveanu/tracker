const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/journal/queries');

//'create page' form
router.get('/create/:user', function (req, res) {
    res.render('createPage', {username: req.params.user});
});

//adds page to journal database
router.post('/create/:user', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('pageError', {location: '/journal/create/' + req.params.user});
        console.log(errors);
    } else {
        try {
            var user = req.params.user;
            var title = req.body.title;
            var content = req.body.content;
            await queries.createPage(user, title, content);
            var link = 'http://localhost:3000/journal/pages/' + user;
            res.redirect(link);
        } catch (error) {
            console.log(error.message);
        }
    }
});

//gets all pages
router.get('/pages/:user', async function (req, res) {
    var journal = await queries.journalPages(req.params.user);
    res.render('journal', {user: req.params.user, pages: journal});
});

//gets selected page
router.get('/page/:id', async function(req, res) {
    var id = req.params.id;
    var page = await queries.selectPage(id);
    res.render('page', {page: page, id: id});
});

//edits journal page content
router.post('/edit/page/:id', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function(req, res) {
    var id = req.params.id;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('pageError', {location: '/journal/page/' + id});
    } else {
        try {
            var title = req.body.title;
            var content = req.body.content;
            await queries.editPage(title, content, id);
            var user = await queries.getUser(id);
            res.redirect('http://localhost:3000/journal/pages/' + user.name);
        } catch (error) {
            console.log(error.message);
        }
    }
});

//deletes selected journal page
router.post('/delete/page/:id', async function(req, res) {
    var id = req.params.id;
    try {
        await queries.deletePage(id);
        var user = await queries.getUser(id);
        res.redirect('http://localhost:3000/journal/pages/' + user.name);
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;