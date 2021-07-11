const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const queries = require('../model/journal/queries');

//gets all pages
router.get('/', async function (req, res) {
    var journal = await queries.journalPages(req.session.username);
    res.render('journal', {user: req.session.username, pages: journal});
});

//gets selected page
router.get('/page/:id', async function(req, res) {
    var id = req.params.id;
    var page = await queries.selectPage(id);
    res.render('page', {page: page, id: id});
});

//'create page' form
router.get('/create/page', function (req, res) {
    res.render('createPage', {username: req.session.username});
});

//adds page to journal database
router.post('/create/page', body('title').isLength({ min: 1 }), body('content').isLength({ min: 1 }), async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('pageError', {location: '/journal/create/page'});
        console.log(errors);
    } else {
        try {
            var user = req.session.username;
            var title = req.body.title;
            var content = req.body.content;
            await queries.createPage(user, title, content);
            res.redirect('http://localhost:3000/journal');
        } catch (error) {
            console.log(error.message);
        }
    }
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
            res.redirect('http://localhost:3000/journal');
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
        res.redirect('http://localhost:3000/journal');
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;